import { useEffect } from 'react';

import '../../remoteEntry/remoteEntry.css';

export const Box = () => {
  useEffect(() => {
    console.log('######## remote2: hooks works \\o/');
  }, []);

  return (
    <section className="p-4 flex text-black lg:text-white bg-yellow-400 lg:bg-orange-600">
      <p>remote 2: Box</p>
      <small>
        <strong className="mx-2">class:</strong>flex text-black lg:text-white
        bg-yellow-400 lg:bg-orange-600
      </small>
    </section>
  );
};
