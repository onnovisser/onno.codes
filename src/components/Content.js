import styled from '@emotion/styled'
import { pagePadding } from '../style/utils'

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

  ${({ noPaddingMobile, theme }) => pagePadding(theme, noPaddingMobile)}
`;


export default Content
