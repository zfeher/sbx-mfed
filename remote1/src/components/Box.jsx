import React, { Suspense } from 'react';
// import dynamic from 'next/dynamic';
import '../../remoteEntry/remoteEntry.css';

import { Box as R2Box } from 'remote2/box';

// const R2Box = React.lazy(() =>
//   import('remote2/box')
//     .then((mod) => ({ default: mod.Box }))
//     .catch((error) => console.error(error)),
// );

// const R2Box = dynamic(() =>
//   import('remote2/box')
//     .then((mod) => mod.Box)
//     .catch((error) => console.error(error)),
// );

export const Box = () => (
  <section className="p-4 flex bg-green-400 text-black">
    <p>remote1: Box</p>
    <small>
      <strong className="mx-2">class:</strong>flex bg-green-400 text-black
    </small>

    <R2Box></R2Box>
  </section>
);
