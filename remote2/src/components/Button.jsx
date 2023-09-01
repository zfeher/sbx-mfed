import { useEffect } from 'react';
import '../../remoteEntry/remoteEntry.css';

export const Button = () => {
  useEffect(() => {
    console.log('######## remote2: hooks works \\o/');
  }, []);

  return (
    <button className="p-4 flex text-black lg:text-white bg-yellow-400 lg:bg-orange-600">
      <p>remote 2: Button</p>
      <small>
        <strong className="mx-2">class:</strong>flex text-black lg:text-white
        bg-yellow-400 lg:bg-orange-600
      </small>
    </button>
  );
};
