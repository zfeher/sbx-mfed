import Head from 'next/head';
// import dynamic from 'next/dynamic';
import { printMe } from 'remote2/print';
import { getAlma } from 'remote2/alma';
import { Title } from 'remote2/title';

// const getAlma = () => 'OFF: remote2::getAlma';
// const printMe = () => console.log('OFF: remote2::printMe');

// const Title = () => (
//   <div>
//     {' '}
//     <p>Title OFF</p>{' '}
//   </div>
// );

// const Title = dynamic(
//   () => import('remote2/title').then((module) => module.Title),
//   { ssr: true },
// );

printMe();

// import('remote2/print').then((module) => console.log(module));

const Remote1Next = () => {
  return (
    <div>
      <Head>
        <title>Remote1 Next</title>
      </Head>

      <Title></Title>

      <div>
        <p>Hello There :)</p>
        <p>{getAlma()}</p>
      </div>
    </div>
  );
};

export default Remote1Next;
