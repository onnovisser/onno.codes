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
  }

  &::before {
    top: -1px;
  }

  &::after {
    bottom: 0;
  }
`;

export default LinedBlock;
