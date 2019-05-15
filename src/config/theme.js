import { lighten } from 'polished';

const color = {
  primary: '#ff4e44', // Color for buttons or links
  primaryAccent: '#e70755',
  primaryLight: lighten(0.05, '#d02e77'),
  bg: 'white', // Background color
  grey: {
    dark: 'rgba(0, 0, 0, 0.9)',
    default: 'rgba(0, 0, 0, 0.7)',
    light: 'rgba(0, 0, 0, 0.5)',
    ultraLight: 'rgba(0, 0, 0, 0.25)',
  },
  white: 'white',
  neutralLightest: '#fafafc',
  neutralLight: '#e0e0e0',
  neutral: '#a0a0a0',
  neutralDark: '#505050',
};

const size = {
  contentWide: '1200px',
  contentNarrow: '700px',
  pagePadding: '40px',
  pagePaddingMobile: '20px',
};

const transitions = {
  fast: '250ms',
};

const fontSize = {
  small: '0.9rem',
};

const fontFamily = {
  base: `'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
  display: `'Lekton', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', serif`,
};

const breakpoints = {
  tablet: '1200px',
  phone: '600px',
};

const theme = {
  color,
  transitions,
  fontSize,
  breakpoints,
  fontFamily,
  size,
  maxWidth: '1000px',
  baseFontSize: '18px',
};

export default theme;
