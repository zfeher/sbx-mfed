import { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge, twJoin } from 'tailwind-merge';
import { cva, cx } from 'class-variance-authority';

import '../../remoteEntry/remoteEntry.css';

//
// test cases
//
const alma1 = /* @no-tw */ 'string';

// not supported comment form
// const alma2 = 'string'; /*@no-tw*/

// @no-tw wins
const alma3 = /* @tw @no-tw */ 'string';

const alma4 = /* @tw */ 'string';

const alma5 = 'p-4 flex text-black';

console.log('p-4 flex text-black');

clsx('p-4 flex text-black');
cx('p-4 flex text-black');
twMerge('p-4 flex text-black');
twJoin('p-4 flex text-black');
cva('p-4 flex text-black');

const korte1 = /* @no-tw */ `string`;

// not supported comment form
// const korte2 = `string`; /*@no-tw*/

// @no-tw wins
const korte3 = /* @tw @no-tw */ `string`;

const korte4 = /* @tw */ `string`;

const korte5 = `p-4 flex text-black`;

console.log(`p-4 flex text-black`);

clsx(`p-4 flex text-black`);
cx(`p-4 flex text-black`);
twMerge(`p-4 flex text-black`);
twJoin(`p-4 flex text-black`);

// first arg can have anything that clsx can take (minus vararg)
const cvaComp = cva([`p-4 flex text-black`, { 'm-4': isActive() }], {
  variants: {
    // leaf prop values can have anything that clsx can take
    intent: {
      primary: 'flex text-white',
      secondary: ['p-4', { 'm-4': isEnabled, ['text-black']: isActive() }],
    },

    size: {
      small: { flex: isEnabled, 'p-4': isActive() },
      medium: ['p-4', { 'm-4': isEnabled, ['text-black']: isActive() }],
    },
  },

  compoundVariants: [
    // class, className can have anything that clsx can take
    { intent: 'primary', size: 'medium', className: 'p-4' },
    {
      intent: 'primary',
      size: 'small',
      class: { flex: isActive(), 'm-4': isEnabled },
    },
  ],

  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

// class, className can have anything that clsx can take
cvaComp();
cvaComp({ intent: 'secondary', size: 'small' });
cvaComp({ intent: 'secondary', size: 'medium', class: 'p-4' });
cvaComp({
  intent: 'secondary',
  size: 'small',
  className: { flex: isActive(), 'm-4': isEnabled },
});

const obj1 = /* @no-tw */ { className: 'p-4 flex' };

// const obj1b = /* @no-tw */ {
//   className: 'p-4 flex',
//   sub: /* @no-tw */ { className: 'p-4 flex' } /* @no-tw */,
// };

// not supported comment form
// const obj2 = { className: 'p-4 flex' }; /* @no-tw */

const obj3 = /* @tw @tw-key @tw-value @no-tw */ { foo: 'p-4 flex' };

const obj4 = /* @tw */ { foo: 'p-4 flex' };

const obj5 = /* @tw-value */ { foo: 'p-4 flex' };

const obj6 = /* @tw-key */ { 'p-4': true, flex: isAllowed() };

const obj7 = { className: 'p-4 flex' };
const obj8 = { class: 'p-4 flex' };
const obj9 = { ['class']: 'p-4 flex' };
const obj10 = { [`class`]: 'p-4 flex' };

const objB1 = /* @no-tw */ { className: `p-4 flex` };

// const objB1b = /* @no-tw */ {
//   className: `p-4 flex`,
//   sub: /* @no-tw */ { className: `p-4 flex` } /* @no-tw */,
// };

// not supported comment form
// const objB2 = { className: `p-4 flex` }; /* @no-tw */

const objB3 = /* @tw @tw-key @tw-value @no-tw */ { foo: `p-4 flex` };

const objB4 = /* @tw */ { foo: `p-4 flex` };

const objB5 = /* @tw-value */ { foo: `p-4 flex` };

const objB6 = /* @tw-key */ { [`p-4`]: true, flex: isAllowed() };

const objB7 = { className: `p-4 flex` };
const objB8 = { class: `p-4 flex` };
const objB9 = { [`class`]: `p-4 flex` };
const objB10 = { [`class`]: `p-4 flex` };

const objC1 = /* @no-tw*/ {
  'p-4': true,
  ['m-4']: true,
  flex: isActive(),
  [`text-black`]: isEnabled,
};

// not supported comment form
// const objC2 = {
//   'p-4': true,
//   ['m-4']: true,
//   flex: isActive(),
//   [`text-black`]: isEnabled,
// }; /* @no-tw*/

const objC3 = /* @tw-key */ {
  'p-4': true,
  ['m-4']: true,
  flex: isActive(),
  [`text-black`]: isEnabled,
};

// pointless to use because === @tw-value :)
const objC4 = /* @tw */ {
  'p-4': true,
  ['m-4']: true,
  flex: isActive(),
  [`text-black`]: isEnabled,
};

// pointless to use :)
const objC5 = /* @tw-value */ {
  'p-4': true,
  ['m-4']: true,
  flex: isActive(),
  [`text-black`]: isEnabled,
};

const objC6 = {
  'p-4': true,
  ['m-4']: true,
  flex: isActive(),
  [`text-black`]: isEnabled,
};

//
// end: test cases
//

export const Box = ({ extraClass = 'text-black' }) => {
  useEffect(() => {
    console.log('######## remote2: hooks works \\o/');
  }, []);

  const style1 = 'p-4 flex text-black';

  return (
    <section className="p-4 flex text-black lg:text-white bg-yellow-400 lg:bg-orange-600">
      <p>remote 2: Box</p>
      <small>
        <strong className="mx-2">class:</strong>flex text-black lg:text-white
        bg-yellow-400 lg:bg-orange-600
      </small>

      <div className="p-4 flex text-black"></div>
      <div className={'p-4 flex text-black'}></div>
      <div className={`p-4 flex text-black`}></div>
      <div className={`p-4 flex ${extraClass}`}></div>
      <div
        className={`${isTrue() && 'p-4'} flex ${isActive && 'text-black'}`}
      ></div>
      <div className={`${getStyle() || 'p-4'} flex`}></div>
      <div className={`${getStyle() ?? 'p-4'} flex`}></div>
      <div className={style1}></div>
      {/* print warn/error :D  */}
      <div className={getStyle()}></div>
      <div className={clsx('p-4 flex text-black')}></div>
      <div className={clsx(`p-4 flex text-black`)}></div>
      <div className={clsx('foo', true && 'bar', isTrue() && 'baz')}></div>
      <div
        className={clsx({
          foo: true,
          bar: false,
          baz: isTrue(),
        })}
      ></div>
      <div
        className={clsx({ foo: true }, { bar: false }, null, {
          '--foobar': 'hello',
        })}
      ></div>
      <div className={clsx(['foo', 0, false, 'bar'])}></div>
      <div
        className={clsx(
          ['foo'],
          ['', 0, false, 'bar'],
          [['baz', [['hello'], 'there']]],
        )}
      ></div>
      <div
        className={clsx(
          'foo',
          [1 && 'bar', { baz: false, bat: null }, ['hello', ['world']]],
          'cya',
        )}
      ></div>
      <div className={twMerge('p-4 flex text-black')}></div>
      <div className={twMerge(`p-4 flex text-black`)}></div>
      <div className={twMerge('p-4', 'flex', 'text-black')}></div>
    </section>
  );
};
