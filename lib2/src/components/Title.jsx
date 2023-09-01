import React, { useEffect } from 'react';
// import _ from 'lodash';

export const Title = () => {
  console.log('######## lib2: loading Title component');
  // console.log(`######## lib2: ${_.join(['ba', 'nan'])}`);

  useEffect(() => {
    console.log('######## lib2: hooks works \\o/');
  }, []);

  return (
    <div>
      <h1>
        {' '}
        This came fom <code>lib2</code> !!!
      </h1>
      <p>And it works like a charm :)</p>
    </div>
  );
};
