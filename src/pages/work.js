import { css } from '@emotion/core';
import React from 'react';
import Page from '../components/page';
import AllWork from '../components/work/all';

function WorkPage() {
  return (
    <Page>
      <div
        css={css`
          min-height: 90vh;
        `}
      />
      <AllWork />
    </Page>
  );
}

export default WorkPage;
