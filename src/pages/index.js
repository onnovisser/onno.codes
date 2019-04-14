import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/page';
import FeaturedWork from '../components/work/featured';

function IndexPage() {
  return (
    <Page>
      <div
        css={css`
          min-height: 80vh;
        `}
      />
      <FeaturedWork />
    </Page>
  );
}

export default IndexPage;
