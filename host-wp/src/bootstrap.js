// import _ from 'lodash';
import { printMe } from './print';
import { printMe as remote1PrintMe } from 'remote1/print';
// import { printMe as remote1PrintMe } from 'remote2/print';

const component = () => {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, now imported by this script
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = 'Hello Again';

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = async () => {
    // const { printMe } = await import('./print');
    // console.log(await import('./print'));
    printMe();

    // lazy
    // const { printMe: remote1PrintMe } = await import('remote1/print');
    remote1PrintMe();

    // dynamic container
    // (async () => {
    //   await addScript('http://localhost:3002/remoteEntry.js');
    //   // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
    //   await __webpack_init_sharing__('default');
    //   const container = window.remote1; // or get the container somewhere else
    //   // Initialize the container, it may provide shared modules
    //   await container.init(__webpack_share_scopes__.default);
    //   const { printMe } = (await container.get('./print'))();
    //   printMe();
    // })();

    // delegated module by docs => not working
    // const { delegate } = await import('delegate1/delegate');
    // const module = await delegate.get('akna', 'kereso');
    // module.printMe();
  };

  element.appendChild(btn);

  return element;
};

document.body.appendChild(component());

printMe();
remote1PrintMe();

const addScript = (src) => {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');

    s.setAttribute('src', src);
    s.addEventListener('load', resolve);
    s.addEventListener('error', reject);

    document.body.appendChild(s);
  });
};
