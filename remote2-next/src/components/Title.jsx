import React, { useEffect } from 'react';

export const Title = () => {
  console.log('######## remote2: loading Title component');

  useEffect(() => {
    console.log('######## remote2: hooks works o/');
  }, []);

  return (
    <div>
      <h2>
        {' '}
        This came fom <code>remote2</code> !!!
      </h2>
      <p>And it works like a charm :)</p>
    </div>
  );
};
