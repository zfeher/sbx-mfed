// todo: if not used elsewhere we can move closer to its usage
const serverLibrary = { type: 'commonjs-module' };

/**
 * source: https://github.com/module-federation/universe/tree/nextjs-mf-7.0.7/packages/nextjs-mf/src/internal.ts
 *   `DEFAULT_SHARE_SCOPE`
 *
 * note: remotes should never provide these dependencies (`import: false` ensures this)
 *   they will be provided only by host (FEP)
 * note: `requiredVersion: false` means it accepts any version of a dependency provided
 * note: `singleton: true` means only one version of a dependency can be used
 *
 * @typedef SharedObject
 * @type {object}
 * @property {object} [key] - The key representing the shared object's package name.
 * @property {boolean} key.singleton - Whether the shared object should be a singleton.
 * @property {boolean} key.requiredVersion - Whether a specific version of the shared object is required.
 * @property {boolean} key.eager - Whether the shared object should be eagerly loaded.
 * @property {boolean} key.import - Whether the shared object should be imported or not.
 */

/** @type {(isServer: boolean) => SharedObject} */
const defaultShareScope = (isServer) => ({
  'next/dynamic': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'next/head': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'next/link': {
    singleton: true,
    requiredVersion: false,
    eager: true,
    import: false,
  },

  'next/router': {
    singleton: true,
    requiredVersion: false,
    eager: !isServer,
    import: false,
  },

  'next/image': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'next/script': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  react: {
    singleton: true,
    requiredVersion: false,
    eager: !isServer,
    import: false,
  },

  'react-dom': {
    singleton: true,
    requiredVersion: false,
    eager: !isServer,
    import: false,
  },

  'react/jsx-dev-runtime': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'react/jsx-runtime': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'styled-jsx': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },

  'styled-jsx/style': {
    singleton: true,
    requiredVersion: false,
    eager: false,
    import: false,
  },
});

exports.serverLibrary = serverLibrary;
exports.defaultShareScope = defaultShareScope;
