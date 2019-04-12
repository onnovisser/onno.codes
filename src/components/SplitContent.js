import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import LinedBlock from './LinedBlock';

function SplitContent({ left, right, flipped, noPaddingMobile }) {
  return (
    <div
      css={({ size }) => css`
        display: grid;
        grid-template-columns:
          minmax(${size.pagePaddingMobile}, 1fr) 8fr 8fr
          minmax(${size.pagePaddingMobile}, 1fr);
        /* grid-template-columns: 1fr auto 1fr; */
        > * {
          grid-row: 1;
        }
      `}
    >
      <LinedBlock
        css={css`
          grid-column: 1 / span 1;
        `}
      />
      <div
        css={css`
        position: relative;
          grid-column: ${flipped ? '3 / span 1' : '2 / span 1'};
        `}
      >{left}</div>
      <LinedBlock
        css={css`
          grid-column: ${flipped ? '2 / span 1' : '3 / span 1'};
        `}
      >
        {right}
      </LinedBlock>
      <LinedBlock
        css={css`
          grid-column: 4 / span 1;
        `}
      />

      <Line
        css={css`
          grid-column: 2;
        `}
      />
      <Line
        css={css`
          grid-column: 3;
        `}
      />
      <Line
        css={css`
          grid-column: 4;
        `}
      />
    </div>
  );
}

const Line = styled.span`
  display: block;
  width: 1px;
  z-index: 0;
  background-color: ${({ theme }) => theme.color.neutralLight};
  /* background-color: rebeccapurple; */
`;

export default SplitContent;
