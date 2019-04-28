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

  ${({ vertical }) =>
    vertical &&
    css`
      &::before,
      &::after {
        width: 1px;
        height: 100%;
        top: 0px;
      }

      &::after {
        left: 100%;
      }
    `}
`;

export default LinedBlock;
