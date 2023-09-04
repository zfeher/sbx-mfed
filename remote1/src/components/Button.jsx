import React, { Suspense } from 'react';
// import dynamic from 'next/dynamic';
import '../../remoteEntry/remoteEntry.css';

import { Button as R2Button } from 'remote2/button';

// const R2Button = React.lazy(() =>
//   import('remote2/button')
//     .then((mod) => ({ default: mod.Button }))
//     .catch((error) => console.error(error)),
// );

// const R2Button = dynamic(() =>
//   import('remote2/button')
//     .then((mod) => mod.Button)
//     .catch((error) => console.error(error)),
// );

export const Button = () => (
  <button className="p-4 flex bg-green-400 text-black">
    <p>remote1: Button</p>
    <small>
      <strong className="mx-2">class:</strong>flex bg-green-400 text-black
    </small>

    <R2Button></R2Button>
  </button>
);
