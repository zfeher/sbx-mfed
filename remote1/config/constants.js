// note: https://github.com/module-federation/universe/blob/main/packages/nextjs-mf/src/internal.ts
const DEFAULT_SHARE_SCOPE = {
  'next/dynamic': {
    eager: false,
    requiredVersion: false,
    singleton: true,
    import: undefined,
  },
  'next/head': {
    eager: false,
    requiredVersion: false,
    singleton: true,
    import: undefined,
  },
  'next/link': {
    eager: true,
    requiredVersion: false,
    singleton: true,
    import: undefined,
  },
  'next/router': {
    requiredVersion: false,
    singleton: true,
    import: false,
    eager: false,
  },
  'next/image': {
    requiredVersion: false,
    singleton: true,
    import: undefined,
    eager: false,
  },
  'next/script': {
    requiredVersion: false,
    singleton: true,
    import: undefined,
    eager: false,
  },
  react: {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },
  'react-dom': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },
  'react/jsx-dev-runtime': {
    singleton: true,
    // requiredVersion: false,
    // eager: false,
    import: undefined,
  },
  'react/jsx-runtime': {
    singleton: true,
    // requiredVersion: false,
    // eager: false,
    import: false,
  },
  'styled-jsx': {
    requiredVersion: false,
    singleton: true,
    import: undefined,
    eager: false,
  },
  'styled-jsx/style': {
    requiredVersion: false,
    singleton: true,
    import: undefined,
    eager: false,
  },
};

// todo: rethink this, now it is the same as defaul share scope
//  same as next config might not be good for remotes but a single host
// const DEFAULT_SHARE_SCOPE_BROWSER = DEFAULT_SHARE_SCOPE;
const DEFAULT_SHARE_SCOPE_BROWSER = Object.entries(DEFAULT_SHARE_SCOPE).reduce(
  (acc, item) => {
    const [key, value] = item;

    acc[key] = { ...value, eager: undefined, import: undefined };

    if (
      key === 'react' ||
      key === 'react-dom' ||
      key === 'next/router' ||
      key === 'next/link'
    ) {
      acc[key].eager = true;
    }
    return acc;
  },
  {},
);

exports.serverLibrary = { type: 'commonjs-module' };

exports.DEFAULT_SHARE_SCOPE = DEFAULT_SHARE_SCOPE;

exports.DEFAULT_SHARE_SCOPE_BROWSER = DEFAULT_SHARE_SCOPE_BROWSER;
