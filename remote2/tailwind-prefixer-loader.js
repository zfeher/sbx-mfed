const path = require('node:path');
const { defaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor');
const { generateRules } = require('tailwindcss/lib/lib/generateRules');
const { createContext } = require('tailwindcss/lib/lib/setupContextUtils');
const { validateConfig } = require('tailwindcss/lib/util/validateConfig');
const loadConfig = require('tailwindcss/lib/public/load-config').default;
const resolveConfig = require('tailwindcss/lib/public/resolve-config').default;
const postCssParse = require('postcss/lib/parse');
const LRU = require('@alloc/quick-lru');
const babelParse = require('@babel/parser').parse;
const babelTraverse = require('@babel/traverse').default;
const babelGenerate = require('@babel/generator').default;
const babelT = require('@babel/types');

/** @typedef {import('@babel/types').TemplateLiteral} TemplateLiteral */
/** @typedef {import('@babel/types').TemplateElement} TemplateElement */
/** @typedef {import('@babel/types').StringLiteral} StringLiteral */
/** @typedef {import('@babel/types').Comment} Comment */

const { validate } = require('schema-utils');

const optionsSchema = {
  type: 'object',
  properties: {
    prefix: { type: 'string' },
    tailwindConfigPath: { type: 'string' },
  },
};

// group, group/{name}, peer, peer/{name}
const groupOrPeerUtilityRegex = /^(?:group|peer)(?:\/[-a-z]+)?$/i;

// @tw
const atTwRegex = /\s*@tw\s*/;
// @no-tw
const atNoTwRegex = /\s*@no-tw\s*/;
// @tw-key
const atTwKeyRegex = /\s*@tw-key\s*/;
// @tw-value
const atTwValueRegex = /\s*@tw-value\s*/;

function TailwindPrefixerLoader(content, map, meta) {
  const options = this.getOptions();

  validate(optionsSchema, options, {
    name: 'Tailwind Prefixer Loader',
    baseDataPath: 'options',
  });

  const { tailwindConfigPath, prefix } = options;

  // quick bail out :)
  if (!prefix) return this.callback(null, content, map, meta);

  const twClassNames = getTailwindClassNames(tailwindConfigPath, content);

  if (twClassNames.length === 0) return this.callback(null, content, map, meta);

  const ast = babelParse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  babelTraverse(ast, {
    StringLiteral(path) {
      // ignore import declaration contexts
      if (path.parentPath.isImportDeclaration()) return;

      const comments = [
        ...(path.node.leadingComments ?? []),
        ...(path.node.trailingComments ??
          path.parentPath.node.trailingComments ??
          []),
      ];

      // /* @no-tw */ => should ignore
      if (hasAtNoTwComment(comments)) return;

      // /* @tw */
      if (hasAtTwComment(comments)) {
        // todo: process as value
        return;
      }

      const context = getContext(path);

      if (context.canSkipProcessing) return;

      // on value side if inside object property +
      //  inside tailwind context or
      //  object or
      //  template literal with /* @tw */, /* @tw-value */ comment
      if (
        !context.isInsideObjectKey &&
        (context.isInsideTailwindContext ||
          context.hasAtTwComment ||
          context.hasAtTwValueComment)
      ) {
        // todo: process as value
        return;
      }

      // on key side +
      //  inside tailwind context or
      //  object with /* @tw-key */ comment
      if (
        context.isInsideObjectKey &&
        (context.isInsideTailwindContext || context.hasAtTwKeyComment)
      ) {
        // todo: process with care object key
        //  need key might be Identifier which => computed prop + StringLiteral
        return;
      }

      // todo: investigate further, process if tw like
      if (
        path.parentPath.isVariableDeclarator() ||
        (path.parentPath.isCallExpression() &&
          path.parentPath.node.callee.object?.name === 'console') ||
        path.parentPath.isAssignmentPattern() ||
        path.parentPath.isObjectProperty()
      ) {
        console.log('@@@@ investigate', path.parentPath.node.type);
        return;
      }

      console.log('@@@@ 1', path.parentPath.node.type);
      // console.log('@@@@ 2', path.parentPath.node.name?.name);
      // console.log('@@@@ 3', path.parentPath.parentPath.node.type);
      // console.log('@@@@ 4', path.parentPath.parentPath.node.name?.name);
      // console.log('@@@@', path.parentPath.node.callee.property.name);

      // todo: print warning/error to use @tw, @tw-key, @tw-value comment

      throw new Error('Should not see this :D');
    },

    TemplateElement(path) {
      // todo: dedupe when the time comes
      const context = getContext(path);

      if (context.canSkipProcessing) return;

      // on value side if inside object property +
      //  inside tailwind context or
      //  object or
      //  template literal with /* @tw */, /* @tw-value */ comment
      if (
        !context.isInsideObjectKey &&
        (context.isInsideTailwindContext ||
          context.hasAtTwComment ||
          context.hasAtTwValueComment)
      ) {
        // todo: process as value
        return;
      }

      // on key side +
      //  inside tailwind context or
      //  object with /* @tw-key */ comment
      if (
        context.isInsideObjectKey &&
        (context.isInsideTailwindContext || context.hasAtTwKeyComment)
      ) {
        // todo: process with care object key
        //  need key might be Identifier which => computed prop + StringLiteral
        return;
      }

      // todo: investigate further, process if tw like
      if (
        path.parentPath.parentPath.isVariableDeclarator() ||
        (path.parentPath.parentPath.isCallExpression() &&
          path.parentPath.parentPath.node.callee.object?.name === 'console') ||
        path.parentPath.parentPath.isAssignmentPattern() ||
        path.parentPath.parentPath.isObjectProperty()
      ) {
        console.log('#### investigate', path.parentPath.parentPath.node.type);
        return;
      }

      console.log('#### 1', path.parentPath.parentPath.node.type);
      // console.log('#### 2', path.parentPath.parentPath.node.name?.name);
      // console.log('#### 3', path.parentPath.parentPath.parentPath.node.type);
      // console.log('#### 4', path.parentPath.parentPath.parentPath.node.name?.name);
      // console.log('####', path.parentPath.parentPath.node.callee.property.name);

      // todo: print warning/error to use @tw, @tw-key, @tw-value comment

      throw new Error('Should not see this :D');
    },

    // ObjectProperty(path) {
    //   // todo
    // },

    // ObjectExpression(path) {
    //   // todo
    // },

    // ObjectPattern(path) {
    //   // todo: if
    // },
  });

  // todo: use, drop
  // classNames.forEach((className) => {
  //   // todo: cache regex instances?
  //   const regex = new RegExp(
  //     `(["'\`]+|\\s+)(${escapeStringRegexp(className)})(["'\`]+|\\s+)`,
  //     'g',
  //   );

  //   content = content.replaceAll(regex, `$1${prefix}$2$3`);
  // });

  const newContent = babelGenerate(
    ast,
    {
      // retainFunctionParens: true,
      retainLines: true,
    },
    content,
  ).code;

  this.callback(null, newContent, map, meta);
}

/**
 * note: meant to be called with leaf like node paths (StringLiteral, TemplateLiteral/TemplateElement, ...)
 *
 * @type {(path: NodePath) => { isInsideTailwindContext: boolean }}
 */
const getContext = (path) => {
  const context = {
    hasAtTwComment: false,
    hasAtTwKeyComment: false,
    hasAtTwValueComment: false,
    twCommentSource: undefined,
    isInsideTailwindContext: false,
    isInsideObjectKey: false,
    isFirstObjectParentVisited: false,
    isFirstTemplateLiteralParentVisited: false,
    canSkipProcessing: false,
    containingObjectProperty: undefined,
    visitedParents: [],
  };

  let currentPath = path;
  while ((currentPath = currentPath.parentPath)) {
    context.visitedParents.push(currentPath);

    if (
      currentPath.isVariableDeclarator() ||
      currentPath.isFunction() ||
      currentPath.isProgram()
    )
      break;

    if (currentPath.isTemplateLiteral()) {
      // note: we don't support nested @tw comments meaning. comments are only
      //  interpreted for the first template literal parent which has the comment.
      //  sub template literals are not affected
      if (!context.isFirstTemplateLiteralParentVisited) {
        context.isFirstTemplateLiteralParentVisited = true;

        const comments = [
          ...(currentPath.node.leadingComments ?? []),
          ...(currentPath.node.trailingComments ??
            currentPath.parentPath.node.trailingComments ??
            []),
        ];

        // /* @no-tw */ => should ignore
        if (hasAtNoTwComment(comments)) {
          context.canSkipProcessing = true;
          context.twCommentSource = currentPath;
          break;
        }

        // /* @tw */
        if (hasAtTwComment(comments)) {
          context.hasAtTwComment = true;
          context.twCommentSource = currentPath;
          break;
        }
      }

      // other cases can be investigated further
    }

    if (currentPath.isJSXAttribute()) {
      // we can early exit in all cases because a component prop has no more
      //  relevant parents
      context.isInsideTailwindContext =
        currentPath.node.name.name === 'className';
      break;
    }

    if (currentPath.isCallExpression()) {
      // console.log/info/debug/...
      if (currentPath.node.callee.object?.name === 'console') break;

      if (
        ['clsx', 'cx', 'twMerge', 'twJoin', 'cva'].includes(
          currentPath.node.callee.name,
        )
      ) {
        // note: if we are in an object key and a `cva` call we need to do extra checks
        //  because we don't want ot accidentally prefix a variant key or name
        if (
          context.isInsideObjectKey &&
          currentPath.node.callee.name === 'cva'
        ) {
          // first arg can have anything valid for `clsx` calls
          // second arg obj `compoundVariants` `class`/className` props can have
          //  anything for `clsx` calls => already handled this
          // second arg obj `variants.[name].[variant].*` can have anything valid for `clsx` calls too
          // `cva` component calls: `cva(...)({..., class, className})` are already handled too

          // we should only allow obj key prefixing inside first arg, second arg leaf
          //  obj property value side and class/classNames mentioned above

          const containedBySecondArg = !context.visitedParents.includes(
            currentPath.get('arguments.0'),
          );

          if (containedBySecondArg) {
            const secondArg = currentPath.get('arguments.1');
            const variantsObjIndex = secondArg.node.properties.findIndex(
              (prop) => prop.key.name === 'variants',
            );
            const variantsObj = secondArg.get(`properties.${variantsObjIndex}`);

            let _parentPath = context.containingObjectProperty;
            let objParentCount = 0;

            while (
              (_parentPath = _parentPath.parentPath) &&
              _parentPath !== variantsObj
            ) {
              objParentCount += _parentPath.isObjectExpression() ? 1 : 0;
            }

            if (objParentCount < 3) {
              context.canSkipProcessing = true;
              break;
            }
          }
        }

        context.isInsideTailwindContext = true;
        break;
      }

      // other calls can be investigated further
    }

    if (currentPath.isObjectExpression() || currentPath.isObjectPattern()) {
      // note: last visited parent === currentPath, we need the parent
      //  before that
      const previousParent = context.visitedParents.at(-2);

      // note: we don't support nested @tw* comments meaning. comments are only
      //  interpreted for the direct props of the object which has the comment,
      //  sub object props are not affected
      if (!context.isFirstObjectParentVisited) {
        context.isFirstObjectParentVisited = true;

        const comments = [
          ...(currentPath.node.leadingComments ?? []),
          ...(currentPath.node.trailingComments ??
            currentPath.parentPath.node.trailingComments ??
            []),
        ];

        // /* @no-tw */ => should ignore
        if (hasAtNoTwComment(comments)) {
          context.canSkipProcessing = true;
          context.twCommentSource = currentPath;
          break;
        }

        // /* @tw-key */
        if (hasAtTwKeyComment(comments)) {
          context.hasAtTwKeyComment = true;
          context.twCommentSource = currentPath;
          break;
        }

        // note: object property key can be a `Identifier`, `StringLiteral`, `TemplateLiteral`, etc
        // note: we only cover simple cases where key value === `path.node`. more involved computed
        //  property keys are unlikely for tailwind use cases
        context.isInsideObjectKey =
          previousParent.isObjectProperty() &&
          previousParent.node.key ===
            (path.isTemplateElement() ? path.parent : path.node);

        if (context.isInsideObjectKey) {
          context.containingObjectProperty = previousParent;
        }

        // /* @tw */ + we are in obj prop value branch
        if (!context.isInsideObjectKey && hasAtTwComment(comments)) {
          context.hasAtTwComment = true;
          context.twCommentSource = currentPath;
          break;
        }

        // /* @tw-value */ + we are in obj prop value branch
        if (!context.isInsideObjectKey && hasAtTwValueComment(comments)) {
          context.hasAtTwValueComment = true;
          context.twCommentSource = currentPath;
          break;
        }
      }

      // note: object property key can be an `Identifier`, `StringLiteral`, `TemplateLiteral`, ...
      //  we cover some of these
      if (
        previousParent.isObjectProperty() &&
        ['class', 'className'].includes(
          previousParent.node.key.name ||
            previousParent.node.key.value ||
            previousParent.node.key.quasis?.[0]?.value?.raw,
        )
      ) {
        // note: here we allow early exit and consider this a tailwind context with
        //  being in an object key (`isInsideObjectKey`) somewhere inside class/className
        //  property value.
        //  the exact known use cases would be only inside `cva(...)` calls in compound variants
        //  and in cva component (result of `cva(...)(...)`) calls. everything else
        //  is not 100% percent but unlikely :)
        context.isInsideTailwindContext = true;
        break;
      }

      // other cases can be investigated further
    }

    // todo: temp log to collect early exit parents
    if (
      !currentPath.isJSXExpressionContainer() &&
      !currentPath.isLogicalExpression() &&
      !currentPath.isTemplateLiteral() &&
      !currentPath.isArrayExpression() &&
      !currentPath.isObjectProperty() &&
      !currentPath.isObjectExpression() &&
      !currentPath.isObjectPattern() &&
      !currentPath.isCallExpression() &&
      !currentPath.isExpressionStatement() &&
      !currentPath.isAssignmentPattern()
    ) {
      console.log('---- parent', currentPath.node.type);
    }
  }

  // todo: cache found results above, save info for visited parents
  return context;
};

/**
 * @type {(comments: Comment[]>) => boolean}
 */
const hasAtNoTwComment = (comments) =>
  comments.some((comment) => atNoTwRegex.test(comment.value));

/**
 * @type {(comments: Comment[]>) => boolean}
 */
const hasAtTwComment = (comments) =>
  comments.some((comment) => atTwRegex.test(comment.value));

/**
 * @type {(comments: Comment[]>) => boolean}
 */
const hasAtTwKeyComment = (comments) =>
  comments.some((comment) => atTwKeyRegex.test(comment.value));

/**
 * @type {(comments: Comment[]>) => boolean}
 */
const hasAtTwValueComment = (comments) =>
  comments.some((comment) => atTwValueRegex.test(comment.value));

const getTailwindClassNames = (tailwindConfigPath, content) => {
  // todo: read once/cached tw config like they do just in case

  // todo: read from actual css once and watch for changes somehow (loader deps)
  // const css = readFile('./remoteEntry/remoteEntry.css', 'utf8');
  const css = '@tailwind utilities';
  const root = postCssParse(css);

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
  Object.assign(context, {
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
      // console.log('@@@@@@@@@@@@@', JSON.stringify(rule));
      return rule.raws.tailwind.candidate;
    })
    // note: just in case, should not happen
    .filter(Boolean);

  // note: for some reason a `rule` won't be created for some group utility
  //  like `group`, `group/{name}`, `peer`, `peer/{name}` pattern
  [...sortedCandidates]
    .filter((candidate) => groupOrPeerUtilityRegex.test(candidate))
    .forEach((candidate) => classNames.push(candidate));

  return classNames;
};

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

const processJsxExpressionContainer = (path) => {
  const expression = path.get('expression');

  if (expression.isStringLiteral())
    return processStringLiteral(expression.node);

  if (expression.isTemplateLiteral()) return processTemplateLiteral(expression);

  // console.log('@@@@@@@@@ jsx exp 1', expression.node.type);
  // console.log('@@@@@@@@@ JSX exp 2', expression.node.expressions);
};

/**
 * @type {(path: import('@babel/traverse').NodePath<TemplateLiteral>) => void}
 */
const processTemplateLiteral = (path) => {
  // console.log('@@@@@@@@@ TLT 1', path.node.quasis.length);
  // console.log('@@@@@@@@@ TLT 2', path.node.expressions.length);

  const { quasis, expressions } = path.node;

  quasis.forEach((quasi) => {
    if (!babelT.isTemplateElement(quasi)) {
      // todo: nicer way, here, or at top level?
      throw new Error(
        `Not supported \`TemplateLiteral\` \`quasis\` item type (${quasi.type}). Consider using supported types or add support for this type ;)`,
      );
    }

    processTemplateElement(quasi);
  });

  // todo: .expressions: [], [...]

  expressions.forEach((expression) => {
    if (babelT.isIdentifier(expression)) {
      // todo
      // processIdentifier(expression);

      // todo: find where it points, find the binding not the references, can path have method?
      //   => prop Identifier ObjectPattern
      //   => props.identifier
      //   => VariableDeclarator with StringLiteral, TemplateLiteral value at first

      if (expression.name === 'extraClass') {
        // path.scope.hasBinding / .hasOwnBinding
        const binding = path.scope.getBinding(expression.name)?.path;
        console.log(
          '@@@@@@@@@@@@@@@ etto 1',
          binding.parentPath.parentPath.node.id.name,
        );

        console.log(
          '@@@@@@@@@@@@@@@ etto 1',
          binding.parent.params[0] === binding.node,
        );

        // we get the ObjectPattern as binding source

        // binding.parent => ArrowFunctionExpression
        // binding.parentPath.node => ArrowFunctionExpression

        // first param is that object?
        // binding.parent.params[0] === binding.node => first func param likely props

        // func has PascalCase name or react typing?
        // binding.parentPath.parentPath.node => VariableDeclarator
        // binding.parentPath.parentPath.node.id.name => ComponentName like Box

        // we can also check func ReturnStatement or body if has JSXElement :D
      }
    }

    // todo
  });
};

/**
 * @type {(node: TemplateElement) => void}
 */
const processTemplateElement = (node) => {
  // note: empty string nothing to do
  if (!node.value.raw) return;

  // { value { raw, cooked? } }

  // note: probably need to update all: `value.raw` and `value.cooked`
  //  `cooked` is not used in generator

  // todo: prefix

  // console.log('@@@@@@@@@ TLE', node.value);
};

// className="text-black lg:text-white bg-yellow-400 lg:bg-orange-600"
/**
 * @type {(node: StringLiteral) => void}
 */
const processStringLiteral = (node) => {
  // note: empty string nothing to do
  if (!node.value) return;

  // note: { value, extra: { raw, rawValue } }
  // note: probably need to update all: `value,` `extra.raw` and `extra.rawValue` (`extra.rawValue === value`)
  //  generator takes `extra.raw` only if `extra.rawValue === value`

  // todo: prefix

  // console.log('@@@@@@@@@ str', node);

  // node.value += 'alma';
};

const extractorCache = new WeakMap();

module.exports = TailwindPrefixerLoader;
