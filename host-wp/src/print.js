import _ from 'lodash';

export const printMe = () => {
  console.log(
    'host: I get called from print.js!',
    _.join(['Hello', 'webpack'], ' '),
  );
  // console.log('I get called from print.js!');
};
