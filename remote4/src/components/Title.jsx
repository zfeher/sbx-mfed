import React, { useEffect } from 'react';
// import _ from 'lodash';
// import { Title as L5Title } from 'lib5';

export const Title = () => {
  console.log('######## remote4: loading Title component');
  // console.log(`######## remote4: ${_.join(['ba', 'nan'])}`);

  useEffect(() => {
    console.log('######## remote4: hooks works \\o/');
  }, []);

  return (
    <div>
      <h1>
        {' '}
        This came fom <code>remote4</code> !!!
      </h1>
      <p>And it works like a charm :)</p>

      {/* <L5Title></L5Title> */}
    </div>
  );
};
