import { css } from '@emotion/core';
import styled from '@emotion/styled';

const LinedBlock = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.color.neutralLightest};

  &::before,
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    background-color: ${({ theme }) => theme.color.neutralLight};
    z-index: 1;
  }

  &::before {
    top: -1px;
  }

  &::after {
    bottom: 0;
  }

  ${({ vertical, theme }) =>
    vertical &&
    css`
      box-shadow: 1px 0 0 0 ${theme.color.neutralLight};

      &::before {
        width: 1px;
        height: 100%;
        top: 0px;
      }

      &::after {
        display: none;
      }
    `}
`;

export default LinedBlock;
