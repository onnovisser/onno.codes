import { css } from '@emotion/core';
import React, { useEffect } from 'react';
import Content from '../components/content';
import Page from '../components/page';
import { replayEmitter } from '../utils/emitter';

function AboutPage() {
  useEffect(() => {
    replayEmitter.emit('changeTerrainState', 2);
    return () => {
      replayEmitter.emit('changeTerrainState', 1);
    };
  }, []);
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
