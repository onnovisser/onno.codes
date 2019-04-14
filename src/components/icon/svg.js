import { css } from '@emotion/core';
import React from 'react';

function Svg({
  children,
  color,
  width = '24px',
  height = '24px',
  ...rest
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      css={(theme) => css`
        width: ${width};
        height: ${height};
        fill: ${color || theme.color.neutralDark};
        transition: fill 250ms;
        vertical-align: middle;
      `}
      {...rest}
    >
      {children}
    </svg>
  );
}

export default Svg;
