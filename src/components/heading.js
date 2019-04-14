import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { oneOf } from 'prop-types';
import themeConfig from '../config/theme';

const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.accent};

  /* ${({ size }) => css``} */

  ${({ color, theme }) => css`
    color: theme.color[color];
  `}
`;

Heading.propTypes = {
  size: oneOf(['small', 'medium', 'large']),
  color: oneOf(Object.keys(themeConfig.color)),
};

Heading.defaultProps = {
  size: 'medium',
  color: 'neutralDark',
};

export default Heading;
