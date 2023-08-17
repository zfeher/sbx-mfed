// import _ from 'lodash';
// import { getKorte } from 'remote2/korte';
// import {
//   importDelegatedModule,
//   injectScript,
// } from '@module-federation/utilities';

const getKorte = () => 'OFF: remote2::getKorte';

export const getAlma = () => {
  // injectScript({
  //   global: 'remote3',
  //   url:
  //     typeof window === 'undefined'
  //       ? 'http://localhost:3006/server/remoteEntry.js'
  //       : 'http://localhost:3006/client/remoteEntry.js',
  // }).then(async (remote) => {
  //   const { printMe } = (await remote.get('./print'))();
  //   printMe();
  // });

  // return `remote1: ${_.join(['al', 'ma'])} | ${getKorte()}`;
  return `remote1: alma | ${getKorte()}`;
};
