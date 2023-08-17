// import _ from 'lodash/join';
import _ from 'lodash';

export const printMe = () => {
  console.log(
    'lib1: I get called from print.js!',
    _.join(['Hello', 'webpack'], ' '),
  );
  // console.log('I get called from print.js!');
};
