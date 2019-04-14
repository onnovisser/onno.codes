import { css } from '@emotion/core';
import React from 'react';
import Content from '../components/content';
import Page from '../components/page';

function AboutPage() {
  return (
    <Page>
      <div
        css={css`
          min-height: 90vh;
        `}
      />
      <Content>
        <p>About</p>
      </Content>
    </Page>
  );
}

export default AboutPage;
