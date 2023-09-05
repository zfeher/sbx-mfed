import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
// import { Title } from 'remote1/title';
import { Box as R1Box } from 'remote1/box';
// import { Box as R2Box } from 'remote2/box';
import { Box as R3Box } from 'remote3/box';
// import _ from 'lodash';

// console.log('next host:', _.join(['next', 'host']));

// const R1Box = React.lazy(() =>
//   import('remote1/box')
//     .then((mod) => ({ default: mod.Box }))
//     .catch((error) => console.error(error)),
// );

// const R1Box = dynamic(
//   () =>
//     import('remote1/box')
//       .then((mod) => mod.Box)
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
        <R1Box></R1Box>
        {/* </Suspense> */}

        {/* <R2Box></R2Box> */}

        <R3Box></R3Box>
      </div>
    </div>
  );
};

export default HostNext;
