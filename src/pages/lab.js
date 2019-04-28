import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/page';

function WorkPage() {
  return (
    <Page>
      <div
        css={css`
          min-height: 90vh;
        `}
      />
    </Page>
  );
}

export default WorkPage;
