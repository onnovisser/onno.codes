import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import mq from '../style/mq';

const Column = styled.div`
  width: 100%;
  flex: auto;
  position: relative;

  &::before {
    content: '';
    width: 1px;
    height: 100%;
    display: block;
    position: absolute;
    left: 100%;
    top: 0;
    background-color: ${({ theme }) => theme.color.neutralLight};
    z-index: 1;
  }
`;

function LinedColumns({ left, right, children, flipped, desktopOnly = true, ...rest }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        position: relative;
        flex-direction: row;

        ${flipped
          ? css`
              flex-direction: row-reverse;

              > ${Column}:first-of-type::before {
                display: none;
              }
            `
          : css`
              > ${Column}:last-of-type::before {
                display: none;
              }
            `}

        ${mq.mediumDown} {
          ${desktopOnly &&
            css`
              flex-direction: column;
              > ${Column}::before {
                display: none;
              }
            `}
        }
      `}
      {...rest}
    >
      {children}
    </div>
  );
}

export default LinedColumns;
export { Column };
