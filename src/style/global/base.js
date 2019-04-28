import { css } from '@emotion/core';
import mq from '../mq';

const base = theme => css`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    background: ${theme.color.neutralLightest};
    background: #f0f0f0;
  }

  ::selection {
    color: ${theme.color.neutralLightest};
    background: ${theme.color.primary};
  }

  html {
    font-family: ${theme.fontFamily.base};
    font-size: ${theme.baseFontSize};
  }

  a {
    text-decoration: none;
  }

  a:not([class]) {
    color: ${theme.color.primary};
    transition: all ${theme.transitions.fast};

    &:hover {
      color: ${theme.color.primaryAccent};
    }
  }

  a:not([href]):not([tabindex]) {
    color: inherit;
    text-decoration: none;
    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }
    &:focus {
      outline: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${theme.color.grey.dark};
    font-family: ${theme.fontFamily.accent};
    /* font-weight: 700; */
  }

  /*  =====  MDX  ===== */

  h2 {
    font-size: 2.441rem;
  }
  h3 {
    font-size: 1.953rem;
  }

  ${mq.mediumUp} {
    h2 {
      font-size: 2.074rem;
    }
    h3 {
      font-size: 1.728rem;
    }
  }

  blockquote {
    font-style: italic;
    position: relative;
  }

  blockquote::before {
    content: '';
    position: absolute;
    background: ${theme.color.primary};
    height: 100%;
    width: 6px;
    margin-left: -1.6rem;
  }
  pre {
    margin-top: 0;
    margin-bottom: 1rem;
    overflow: auto;
  }

  .dg.ac {
    z-index: 999 !important;
  }
`;

export default base;
