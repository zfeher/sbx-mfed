import React, { useEffect } from 'react';

export const Title = () => {
  console.log('######## remote1: loading Title component');

  useEffect(() => {
    console.log('######## remote1: hooks works o/');
  }, []);

  return (
    <div>
      <h1>
        {' '}
        This came fom <code>remote1</code> !!!
      </h1>
      <p>And it works like a charm :)</p>
    </div>
  );
};
