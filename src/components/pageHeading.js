import { css } from '@emotion/core';
import React from 'react';
import Content from './content';
import Heading from './heading';

function PageHeading({ children }) {
  return (
    <Content>
      <div
        css={css`
          padding-top: 10vh;
          min-height: 70vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        `}
      >
        <Heading size={900} weight={700}>
          {children}
        </Heading>
      </div>
    </Content>
  );
}

export default PageHeading;
