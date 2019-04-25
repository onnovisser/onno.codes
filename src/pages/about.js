import { css } from '@emotion/core';
import React, { useEffect } from 'react';
import Content from '../components/content';
import Page from '../components/page';
import emitter from '../utils/emitter';

function AboutPage() {
  useEffect(() => {
    console.log(emitter);
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
      <Content>
        <p>About</p>
      </Content>
    </Page>
  );
}

export default AboutPage;
