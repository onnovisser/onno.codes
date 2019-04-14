import { css } from '@emotion/core';
import React from 'react';
import mq from '../style/mq';

function SplitColumns({ left, right, flipped, ...rest }) {
  return (
    <div
      css={({ color }) => css`
        display: flex;
        align-items: stretch;
        flex-direction: column;
        position: relative;

        ${mq.mediumUp} {
          flex-direction: row;

          > div {
            width: 50%;
            flex: 1 1 50%;
            position: relative;

            &:last-child {
              border-left: 1px solid ${color.neutralLight};
            }
          }

          ${flipped &&
            css`
              flex-direction: row-reverse;

              > div {
                &:last-child {
                  border-left: none;
                }

                &:first-of-type {
                  border-left: 1px solid ${color.neutralLight};
                }
              }
            `}
        }
      `}
      {...rest}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export default SplitColumns;
