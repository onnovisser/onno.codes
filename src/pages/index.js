import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/page';
import FeaturedWork from '../components/work/featured';

function IndexPage() {
  return (
    <Page>
      <div
        css={css`
          min-height: 90vh;
        `}
      />
      <FeaturedWork />
    </Page>
  );
}

export default IndexPage;
