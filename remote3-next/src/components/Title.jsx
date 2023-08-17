import React, { useEffect } from 'react';
import { Title as Remote2Title } from 'remote2/title';

export const Title = () => {
  console.log('######## remote3: loading Title component');

  useEffect(() => {
    console.log('######## remote3: hooks works o/');
  }, []);

  return (
    <div className="mfe-remote3">
      <h1>
        {' '}
        This came fom <code>remote3</code> !!!
      </h1>
      <p>And it works like a charm :)</p>

      <Remote2Title></Remote2Title>
    </div>
  );
};
