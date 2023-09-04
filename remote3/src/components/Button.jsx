import { Button as R2Button } from 'remote2/button';
import '../../remoteEntry/remoteEntry.css';

export const Button = () => (
  <button className="p-4 flex bg-green-400 text-black">
    <p>remote3: Button</p>
    <small>
      <strong className="mx-2">class:</strong>flex bg-green-400 text-black
    </small>

    <R2Button></R2Button>
  </button>
);
