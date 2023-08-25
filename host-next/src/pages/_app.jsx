import App from 'next/app';

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context);
  // return { ...ctx, example: 'data' };
  return ctx;
};

export default MyApp;
