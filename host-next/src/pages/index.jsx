import Head from 'next/head';
import React from 'react';
// import { printMe } from 'remote1/print';
// import { getAlma } from 'remote1/alma';
// import { Title } from 'remote1/title';
import { Button as R1Button } from 'remote1/button';
// import { Button as R2Button } from 'remote2/button';
import { Button as R3Button } from 'remote3/button';

const printMe = () => {};
const getAlma = () => {};

const Title = () => <p>Title</p>;
// const R1Button = () => <p>R1Button</p>;
// const R2Button = () => <p>R2Button</p>;
// const R3Button = () => <p>R3Button</p>;

printMe();

const HostNext = () => {
  return (
    <div>
      <Head>
        <title>Host Next</title>
      </Head>

      <Title></Title>

      <div>
        <p>Hello There :)</p>
        <p>{getAlma()}</p>

        <R1Button></R1Button>

        {/* <R2Button></R2Button> */}

        <R3Button></R3Button>
      </div>
    </div>
  );
};

export default HostNext;
