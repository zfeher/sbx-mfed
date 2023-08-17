import React, { useEffect } from 'react';
import { Title as Remote2Title } from 'remote2/title';

export const Title = () => {
  console.log('######## remote1: loading Title component');

  useEffect(() => {
    console.log('######## remote1: hooks works o/');
  }, []);

  return (
    <div className="mfe-remote1">
      <h1>
        {' '}
        This came fom <code>remote1</code> !!!
      </h1>
      <p>And it works like a charm :)</p>

      <Remote2Title></Remote2Title>
    </div>
  );
};
