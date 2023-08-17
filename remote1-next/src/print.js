// import _ from 'lodash';
// import { printMe as remote2PrintMe } from 'remote2/print';

const remote2PrintMe = () => console.log('OFF: remote2::printMe');

export const printMe = () => {
  console.log(
    'remote1: I get called from print.js!',
    // _.join(['Hello', 'webpack'], ' '),
  );
  // console.log('I get called from print.js!');
  console.log('remote1 s----');
  remote2PrintMe();
  console.log('remote1 e----');
};
