const { ConcatSource } = require('webpack-sources');
const { Template } = require('./Template');
const { template } = require('./custom-jsonp');

function getCustomJsonpCode(chunkLoadingGlobal, RuntimeGlobals) {
  const code = [
    'var chunkQueue = [];',
    'var chunkTracker = [];',
    `var chunkLoadingGlobal = self[${JSON.stringify(
      chunkLoadingGlobal,
    )}] || [];`,
    'var asyncQueue = [];',
    template,
  ];
  return Template.asString(code);
}

class CustomWebpackPlugin {
  options;

  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('CustomWebpackPlugin', (compilation) => {
      compilation.hooks.runtimeModule.tap(
        'CustomWebpackPlugin',
        (runtimeModule, chunk) => {
          if (this.options.server && chunk.name === 'webpack-runtime') {
            // if server runtime module
          }

          if (
            runtimeModule.constructor.name ===
              'JsonpChunkLoadingRuntimeModule' &&
            chunk.name === 'webpack'
          ) {
            const originalSource = runtimeModule.getGeneratedCode();
            if (!originalSource) return;

            const modifiedSource = new ConcatSource(
              originalSource,
              '\n',
              getCustomJsonpCode(
                //@ts-ignore
                compilation.outputOptions.chunkLoadingGlobal,
                compiler.webpack.RuntimeGlobals,
              ),
            );
            runtimeModule.getGeneratedCode = () => modifiedSource.source();
          }
        },
      );
    });
  }
}

// export default CustomWebpackPlugin;
exports.JsonpChunkLoadingRuntimeModule = CustomWebpackPlugin;
