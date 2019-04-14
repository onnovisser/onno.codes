import { css } from '@emotion/core';
import mq from '../mq';

const base = theme => css`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  body {
    background-image: radial-gradient(white, rgba(255, 255, 255, 0) 90%),
      linear-gradient(
        to right,
        ${theme.color.ghost},
        ${theme.color.tropicalBlue}
      );

    background: ${theme.color.neutralLightest};
  }

  ::selection {
    color: ${theme.color.bg};
    background: ${theme.color.primary};
  }

  html {
    font-family: ${theme.fontFamily.sansSerif};
    font-size: ${theme.baseFontSize};
  }

  a {
    /* color: ${theme.color.primary}; */
    text-decoration: none;
    /* transition: all ${theme.transitions.normal}; */
  }

  /* a:hover {
    color: ${theme.color.primaryLight};
  } */
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
    font-family: ${theme.fontFamily.serif};
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
