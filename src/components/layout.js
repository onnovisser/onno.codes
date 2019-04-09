import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import React, { lazy, Suspense } from 'react';
import theme from '../config/theme';
import globalStyles from '../style/global';
import BrowserOnlyRender from './BrowserOnlyRender';

const Background = lazy(() => import('./Background'))

function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <BrowserOnlyRender>
        <Suspense fallback={<div />}>
          <Background />
        </Suspense>
      </BrowserOnlyRender>
      <Global styles={globalStyles} />
      {children}
    </ThemeProvider>
  )
}

export default Layout
