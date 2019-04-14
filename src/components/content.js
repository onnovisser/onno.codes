import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import mq from '../style/mq';
import LinedBlock from './linedBlock';

function Content({
  children,
  narrow,
  noPaddingMobile,
  border,
  borderLeft,
  borderRight,
  ...rest
}) {
  return (
    <div
      css={({ size }) => css`
        width: 100%;
        display: grid;
        grid-template-columns:
          minmax(${size.pagePaddingMobile}, 1fr) minmax(
            auto,
            ${narrow ? size.contentNarrow : size.contentWide}
          )
          minmax(${size.pagePaddingMobile}, 1fr);

        ${noPaddingMobile &&
          css`
            grid-template-columns: 0 minmax(auto, 1400px) 0;
            max-width: 100%;
          `}

        ${mq.mediumUp} {
          grid-template-columns:
            minmax(${size.pagePadding}, 1fr) minmax(
              auto,
              ${narrow ? size.contentNarrow : size.contentWide}
            )
            minmax(${size.pagePadding}, 1fr);
        }

        > * {
          grid-row: 1;
        }
      `}
    >
      <div
        css={css`
          position: relative;
          grid-column: 2 / span 1;
        `}
        {...rest}
      >
        {children}
      </div>
      {(border || borderLeft) && (
        <>
          <LinedBlock
            css={css`
              grid-column: 1 / span 1;
            `}
          />
          <Line
            css={css`
              grid-column: 1;
              justify-self: end;
            `}
          />
        </>
      )}
      {(border || borderRight) && (
        <>
          <LinedBlock
            css={css`
              grid-column: 3 / span 1;
            `}
          />
          <Line
            css={css`
              grid-column: 3;
            `}
          />
        </>
      )}
    </div>
  );
}

const Line = styled.span`
  display: block;
  width: 1px;
  z-index: 0;
  background-color: ${({ theme }) => theme.color.neutralLight};

  ${mq.mediumDown} {
    display: none;
    width: 0;
  }
`;

export default Content;
