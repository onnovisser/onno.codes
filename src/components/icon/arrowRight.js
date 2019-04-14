import { css } from '@emotion/core';
import React from 'react';
import Svg from './svg';

function ArrowRightIcon(props) {
  return (
    <Svg
      {...props}
      css={css`
        transform: rotate(-90deg);
      `}
    >
      <path d="M 11 3 L 11 17.070312 L 6.4296875 12.5 L 4.9296875 14 L 12 21.070312 L 19.070312 14 L 17.570312 12.5 L 13 17.070312 L 13 3 L 11 3 z" />
    </Svg>
  );
}

export default ArrowRightIcon;
