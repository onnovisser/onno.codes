import { css } from '@emotion/core';
import React from 'react';
import mq from '../style/mq';

function SplitColumns({ left, right, flipped }) {
  return (
    <div
      css={({ color }) => css`
        display: flex;
        align-items: stretch;
        flex-direction: column;
        position: relative;

        ${mq.mediumUp} {
          flex-direction: row;
/*
          &::before {
            content: '';
            display: block;
            width: 1px;
            height: 100%;
            position: absolute;
            right: 50%;
            top: 0;
            background-color: ${color.neutralLight};
            z-index: 1;
          } */
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

                &:first-child {
                  border-left: 1px solid ${color.neutralLight};
                }
              }
            `}
        }
      `}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export default SplitColumns;
