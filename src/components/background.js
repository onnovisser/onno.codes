import { css } from '@emotion/core';
import React, { useEffect, useRef, useState } from 'react';
import init from '../gl/init';

console.log(performance.now());

function Background() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    console.log(performance.now());
    (window.requestIdleCallback ? requestIdleCallback : requestAnimationFrame)(
      () => {
        console.log(performance.now());
        if (performance.now() > 4000) {
          // slow network, don't load all the webgl stuff
          // TODO: Maybe show something as a fallback
          // return;
        }
        init(ref.current).then(() => {
          setVisible(true);
        });
      }
    );
  }, []);

  return (
    <canvas
      css={() => css`
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0;
        transition: opacity .5s ease .25s;

        ${visible &&
          css`
            opacity: 1;
          `};
      `}
      ref={ref}
    />
  );
}

export default Background;
