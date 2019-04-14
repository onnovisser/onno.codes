const breakpoints = {
  small: 500,
  medium: 800,
  large: 1100,
  xlarge: 1600,
};

const ZERO = 0;
const INFINITY = 99999;

/**
 * A Media Query utility for CSS-in-JS / React
 *
 * const Styled = styled.div`
 *   display: block;
 *   ${mq.largeUp} {
 *     border: 3px solid tomato;
 *   }
 * `;
 *
 * <div>
 *   {mq.is.largeUp && <SomeComponent />}
 *   {mq.is({ min: 300 }) && <SomeOtherComponent />}
 * </div>
 *
 */

/**
 * Creates a function for a given range to use with CSS-in-JS
 *
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {Function}
 * @example
 * mq('largeUp')
 * mq({ min: 900 })
 * mq({ min: 300, max: 900 })
 */
function _mq(range) {
  return createQueryString(...parseObject(range));
}

const mq = new Proxy(_mq, {
  get(target, prop) {
    // if (prop === 'is') {
    //   return isMQ;
    // }
    return createQueryString(...parseProp(prop));
  },
});

/**
 * Checks the window width against a media range.
 *
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {bool} Whether the page width is within the range
 */
function _isMQ(range) {
  return window.matchMedia(createQuery(...parseObject(range))).matches;
}

const isMQ = new Proxy(_isMQ, {
  get: (object, prop) => isMQ(prop),
});

// /**
//  * Creates a CSS media query string for a given range
//  *
//  * @param {string|Object} range - A key used in the media range config or a custom range object
//  * @returns {string}
//  */
// function getMQ(range) {
//   const [min, max] = parseObject(range);
//   return `(min-width: ${min}px) and (max-width: ${max}px)`;
// }

function createQueryString(min, max) {
  return `@media ${createQuery(min, max)}`;
}

function createQuery(min = ZERO, max = INFINITY) {
  return `(min-width: ${min}px) and (max-width: ${max}px)`;
}

function parseProp(name) {
  let parts;
  let min;
  let max;

  if ((parts = name.match(/(\w+)Up$/))) {
    min = breakpoints[parts[1]];
  } else if ((parts = name.match(/(\w+)Down$/))) {
    max = breakpoints[parts[1]] - 1;
  } else if ((parts = name.match(/(\w+)To(\w+)/))) {
    min = breakpoints[parts[1]];
    max = breakpoints[parts[2].toLowerCase()] - 1;
  }

  return [min, max];
}

function parseObject(range) {
  return [range.min, range.max].map(v =>
    typeof v === 'string' ? parseInt(v) : v
  );
}

export { breakpoints as bp };
export default mq;
