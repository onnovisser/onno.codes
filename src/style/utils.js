import { css } from '@emotion/core';
import mq from './mq';

export const paddingX = ({ size }, noPaddingMobile) => css`
  ${!noPaddingMobile &&
    css`
      padding-left: ${size.pagePaddingMobile};
      padding-right: ${size.pagePaddingMobile};
    `}
  ${mq.mediumUp} {
    padding-left: ${size.pagePadding};
    padding-right: ${size.pagePadding};
  }
`;

export const paddingY = ({ size }) => css`
  padding-top: ${size.pagePaddingMobile};
  padding-bottom: ${size.pagePaddingMobile};
  ${mq.mediumUp} {
    padding-top: ${size.pagePadding};
    padding-bottom: ${size.pagePadding};
  }
`;
