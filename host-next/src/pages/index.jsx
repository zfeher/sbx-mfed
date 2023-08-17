import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
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

// const R1Button = dynamic(
//   async () => {
//     console.log('R1Button requested');
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log('R1Button importing...');
//     return import('remote1/button').then((module) => module.Button);
//   },
//   { ssr: false },
// );

// const R3Button = dynamic(
//   async () => {
//     console.log('R3Button requested');
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     console.log('R3Button importing...');
//     return import('remote3/button').then((module) => module.Button);
//   },
//   { ssr: false },
// );

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

        {/* <Suspense> */}
        <R3Button></R3Button>
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default HostNext;
