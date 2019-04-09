import { css } from '@emotion/core';
// content: "\200B";  /* add zero-width space https://unfetteredthoughts.net/2017/09/26/voiceover-and-list-style-type-none/ */
const reset = css`
  /* prettier-ignore */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  ul {
    list-style: none;
    padding-left: 20px;
  }
  li::before {
  }

  button {
    -webkit-appearance: none;
    background: transparent;
    border: none;
  }

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  img,
  iframe,
  video {
    height: auto;
    max-width: 100%;
  }

  iframe {
    border: 0;
  }

  img {
    vertical-align: middle;
  }

  [role='button'] {
    cursor: pointer;
  }

  a,
  area,
  button,
  [role='button'],
  input,
  label,
  select,
  summary,
  textarea {
    touch-action: manipulation;
  }

  svg:not(:root) {
    overflow: hidden;
    vertical-align: middle;
  }
`;

export default reset;
