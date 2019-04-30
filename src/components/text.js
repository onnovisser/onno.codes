import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { oneOf, bool } from 'prop-types';
import themeConfig from '../config/theme';
import mq from '../style/mq';

const Text = styled.p`
  ${({ color, theme, size, weight, italic, variant }) => css`
    font-size: ${(Math.pow(size/1000, 2.5) * 4 + .75).toFixed(1)}rem;
    font-weight: ${weight};
    font-style: ${italic ? 'italic' : 'normal'};
    font-family: ${theme.fontFamily[variant]};
    line-height: 1.5;
    color: ${theme.color[color]};

    ${mq.mediumDown} {
      font-size: ${(Math.pow(size/1000, 2) * 2 + .75).toFixed(1)}rem;
    }
  `}
`;

Text.propTypes = {
  size: oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  weight: oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  italic: bool,
  variant: oneOf(['body', 'display']),
  color: oneOf(Object.keys(themeConfig.color)),
};

Text.defaultProps = {
  size: 300,
  weight: 400,
  color: 'neutralDark',
  variant: 'body',
};

export default Text;
