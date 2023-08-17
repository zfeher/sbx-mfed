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

  const delegateUrl = `${url}/remoteEntry.js`;
  importDelegatedModule({
    global,
    url: delegateUrl,
  })
    .then((remote) => resolve(remote))
    .catch((error) => reject(error));
});
