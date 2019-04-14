import { css } from '@emotion/core';
import styled from '@emotion/styled';
import mq from '../style/mq';
import { pagePadding } from '../style/utils';

const Content = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.size.contentWide};
  margin-left: auto;
  margin-right: auto;
  position: relative;

  ${({ narrow, theme }) =>
    narrow &&
    css`
      max-width: ${theme.size.contentNarrow};
    `}

  ${({ noPaddingMobile, noPadding, theme }) => !noPadding && pagePadding(theme, noPaddingMobile)}

  ${({ narrow, theme }) => css`
    ${mq({ min: narrow ? theme.size.contentNarrow : theme.size.contentWide })} {
      padding: 0;
    }
  `};
`;

export default Content;
