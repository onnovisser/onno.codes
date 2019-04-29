import { css } from '@emotion/core';
import React, { useEffect } from 'react';
import Content from '../components/content';
import Page from '../components/page';
import emitter from '../utils/emitter';
import LinedBlock from '../components/linedBlock';
import Heading from '../components/heading';

function AboutPage() {
  useEffect(() => {
    emitter.emit('changeTerrainState', 2);
    return () => {
      emitter.emit('changeTerrainState', 1);
    };
  }, []);
  return (
    <Page>
      <div
        css={css`
          min-height: 90vh;
        `}
      />
      <LinedBlock
        css={css`
          height: 10vh;
          margin-bottom: 10vh;
          display: flex;
          align-items: center;
        `}
      >
        <Content>
          <Heading>About</Heading>
        </Content>
      </LinedBlock>
    </Page>
  );
}

export default AboutPage;
