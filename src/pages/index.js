import React from 'react';
import { css} from '@emotion/core'
import SplitContent from '../components/SplitContent';
import Page from '../components/Page';
import FeaturedWork from '../components/work/Featured';

function IndexPage() {
  return (
    <Page>
      <div css={css`
        min-height: 90vh;
      `} />
        <FeaturedWork />

    </Page>
  );
}

export default IndexPage;
