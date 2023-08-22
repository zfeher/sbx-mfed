export const Button = () => {
  return (
    // we need this wrapper div to add scope class
    <button className="p-4 flex text-black lg:text-white bg-yellow-400 lg:bg-orange-600">
      <p>remote 1: Button</p>
      <small>
        <strong className="mx-2">class:</strong>flex text-black lg:text-white
        bg-yellow-400 lg:bg-orange-600
      </small>
    </button>
  );
};
