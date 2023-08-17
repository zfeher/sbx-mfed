module.exports = new Promise(async (resolve, reject) => {
  const { importDelegatedModule } = await import(
    '@module-federation/utilities'
  );

  //Logging the delegate being called for the resourceQuery from the webpack runtime ID
  // console.log(
  //   'Delegate being called for',
  //   __resourceQuery,
  //   'from',
  //   __webpack_runtime_id__,
  // );

  const currentRequest = new URLSearchParams(__resourceQuery).get('remote');
  const [global, url] = currentRequest.split('@');
  const isBrowser = typeof window !== 'undefined';

  // note: browser only for now
  if (isBrowser) {
    const styleUrl = `${url}/remoteEntry.css`;
    console.log('#### host: load remote style', url);
    loadStyle(styleUrl).catch((error) => {
      // note: we let the remote live without style for now
      console.error(error);
    });
  }

  const delegateUrl = `${url}/remoteEntry.js`;
  importDelegatedModule({
    global,
    url: delegateUrl,
  })
    .then((remote) => resolve(remote))
    .catch((error) => reject(error));
});

const loadStyle = (url) =>
  new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';

    link.onerror = reject;

    link.onload = () => {
      // todo: might wanna keep track of which style is loaded etc and not load again
      resolve();
    };

    document.head.append(link);
  });
