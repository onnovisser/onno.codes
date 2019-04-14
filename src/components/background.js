import React, { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/core';
import init from '../gl/scene';

function Background() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    init(ref.current).then(() => {
      setVisible(true);
    });
  }, []);

  return (
    <canvas
      css={() => css`
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: -1;

        ${visible &&
          css`
            opacity: 1;
            transition: opacity 1s ease;
          `};
      `}
      ref={ref}
    />
  );
}

export default Background;
