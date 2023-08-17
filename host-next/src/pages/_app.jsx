import App from 'next/app';
import initUnocssRuntime from '@unocss/runtime';
import presetWind from '@unocss/preset-wind';

if (typeof window !== 'undefined') {
  initUnocssRuntime({
    defaults: {
      presets: [presetWind()],
    },
  });

  // (async () => {
  //   const [{ default: initUnocssRuntime }, { default: presetWind }] =
  //     await Promise.all([
  //       import('@unocss/runtime'),
  //       import('@unocss/preset-wind'),
  //     ]);

  //   initUnocssRuntime({
  //     defaults: {
  //       presets: [presetWind()],
  //     },
  //   });
  // })();
}

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context);
  // return { ...ctx, example: 'data' };
  return ctx;
};

export default MyApp;
