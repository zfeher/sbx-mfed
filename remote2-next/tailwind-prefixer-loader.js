const path = require('node:path');
const { defaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor');
const { generateRules } = require('tailwindcss/lib/lib/generateRules');
const { createContext } = require('tailwindcss/lib/lib/setupContextUtils');
const { validateConfig } = require('tailwindcss/lib/util/validateConfig');
const loadConfig = require('tailwindcss/lib/public/load-config').default;
const resolveConfig = require('tailwindcss/lib/public/resolve-config').default;
const parse = require('postcss/lib/parse');
const LRU = require('@alloc/quick-lru');

const { validate } = require('schema-utils');

const optionsSchema = {
  type: 'object',
  properties: {
    prefix: { type: 'string' },
    tailwindConfigPath: { type: 'string' },
  },
};

function TailwindPrefixerLoader(content, map, meta) {
  const options = this.getOptions();

  validate(optionsSchema, options, {
    name: 'Tailwind Prefixer Loader',
    baseDataPath: 'options',
  });

  const { tailwindConfigPath, prefix } = options;

  if (!prefix) return this.callback(null, content, map, meta);

  // todo: read once/cached tw config like they do just in case

  // todo: read from actual css once and watch for changes somehow (loader deps)
  // const css = readFile('./remoteEntry/remoteEntry.css', 'utf8');
  const css = '@tailwind utilities';
  const root = parse(css);

  // todo: getTailwindConfig/resolveConfigPath
  // todo: watch for changes somehow (loader deps)
  const userConfigPath = tailwindConfigPath
    ? path.resolve(tailwindConfigPath)
    : undefined;
  // const tailwindConfig = loadConfig(path.resolve(configPath));
  const tailwindConfig = validateConfig(
    resolveConfig(loadConfig(userConfigPath)),
  );
  // note: we don't need this we have the actual file content at hand
  tailwindConfig.content = [];

  const context = createContext(tailwindConfig, [], root);
  Object.assign(this.context, {
    userConfigPath,
  });

  const extractor = defaultExtractor(context);
  const candidates = new Set();
  const seen = new Set();
  getClassCandidates(content, extractor, candidates, seen);

  const sortedCandidates = new Set(
    [...candidates].sort((a, z) => {
      if (a === z) return 0;
      if (a < z) return -1;
      return 1;
    }),
  );

  const rules = generateRules(sortedCandidates, context);

  const classNames = rules
    .map(([sort, rule]) => {
      // sort.layer 'utilities' => rule.selector, rule.raws.tailwind.classCandidate, rule.raws.tailwind.candidate
      // sort.layer 'variants' => rule.raws.tailwind.candidate
      //  rule.nodes[0].selector => escaped '.lg\\:bg-orange-60'
      //  rule.selector may exist here and escaped, or first node.selector too
      // .selector is escaped: more visible for variants than utilities
      return rule.raws.tailwind.candidate;
    })
    // note: just in case, should not happen
    .filter(Boolean);

  const hasStaticClassName = classNames.some(
    (className) => className === 'static',
  );

  if (hasStaticClassName) {
    // note: we might have ambiguous `static` usage like `static async getInitialProps() {...}`
    //  etc. which we want to save from prefixing so we replace them with '__STATIC__'
    //  until prefixing is done, then restore 'static` afterwards <- a hack 😎
    const regex = /static(\s(async\s)?\w+\s?\()/g;
    content = content.replaceAll(regex, '__STATIC__$1');
  }

  classNames.forEach((className) => {
    // todo: cache regex instances?
    const regex = new RegExp(
      `(["'\`]+|\\s+)(${escapeStringRegexp(className)})(["'\`]+|\\s+)`,
      'g',
    );

    content = content.replaceAll(regex, `$1${prefix}$2$3`);
  });

  if (hasStaticClassName) {
    const regex = /__STATIC__(\s(async\s)?\w+\s?\()/g;
    content = content.replaceAll(regex, 'static$1');
  }

  this.callback(null, content, map, meta);
}

/*
 * source: https://github.com/sindresorhus/escape-string-regexp/blob/v5.0.0/index.js
 */
const escapeStringRegexp = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
};

/*
 * Scans template contents for possible classes. This is a hot path on initial build but
 * not too important for subsequent builds. The faster the better though — if we can speed
 * up these regexes by 50% that could cut initial build time by like 20%.
 *
 * source: https://github.com/tailwindlabs/tailwindcss/blob/v3.3.3/src/lib/expandTailwindAtRules.js
 */
function getClassCandidates(content, extractor, candidates, seen) {
  if (!extractorCache.has(extractor)) {
    extractorCache.set(extractor, new LRU({ maxSize: 25000 }));
  }

  for (let line of content.split('\n')) {
    line = line.trim();

    if (seen.has(line)) {
      continue;
    }
    seen.add(line);

    if (extractorCache.get(extractor).has(line)) {
      for (let match of extractorCache.get(extractor).get(line)) {
        candidates.add(match);
      }
    } else {
      let extractorMatches = extractor(line).filter((s) => s !== '!*');
      let lineMatchesSet = new Set(extractorMatches);

      for (let match of lineMatchesSet) {
        candidates.add(match);
      }

      extractorCache.get(extractor).set(line, lineMatchesSet);
    }
  }
}

const extractorCache = new WeakMap();

module.exports = TailwindPrefixerLoader;
