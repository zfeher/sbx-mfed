import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
// import { Title } from 'remote1/title';
import { Button as R1Button } from 'remote1/button';
// import { Button as R2Button } from 'remote2/button';
import { Button as R3Button } from 'remote3/button';
// import _ from 'lodash';

// console.log('next host:', _.join(['next', 'host']));

// const R1Button = React.lazy(() =>
//   import('remote1/button')
//     .then((mod) => ({ default: mod.Button }))
//     .catch((error) => console.error(error)),
// );

// const R1Button = dynamic(
//   () =>
//     import('remote1/button')
//       .then((mod) => mod.Button)
//       .catch((error) => console.error(error)),
//   {
//     ssr: true,
//   },
// );

const HostNext = () => {
  return (
    <div>
      <Head>
        <title>Host Next</title>
      </Head>

      <div>
        <p>Hello There :)</p>

        {/* <Suspense> */}
        <R1Button></R1Button>
        {/* </Suspense> */}

        {/* <R2Button></R2Button> */}

        <R3Button></R3Button>
      </div>
    </div>
  );
};

export default HostNext;
