import { css } from '@emotion/core';
import mq from './mq';

export const pagePadding = ({ size }, noPaddingMobile) => css`
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
