import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/Page';
import FeaturedWork from '../components/work/Feat';

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
