import _ from 'lodash';

export const printMe = () => {
  console.log(
    'remote3: I get called from print.js!',
    _.join(['Hello', 'webpack'], ' '),
  );
};
