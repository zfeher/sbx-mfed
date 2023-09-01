import { useEffect } from 'react';
import '../../remoteEntry/remoteEntry.css';

export const Title = () => {
  useEffect(() => {
    console.log('######## remote2: hooks works \\o/');
  }, []);

  return (
    <div>
      <h2>
        {' '}
        This came fom <code>remote2</code> !!!
      </h2>
      <p>And it works like a charm :)</p>
    </div>
  );
};
