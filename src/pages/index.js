import React, { useState, useEffect } from 'react';
import Page from '../components/page';
import { css } from '@emotion/core';
import PageHeading from '../components/pageHeading';
import FeaturedWork from '../components/work/featured';

function IndexPage() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    emitter.emit('changeExplodeModifier', hovered ? 1 : 0);
  }, [hovered]);

  return (
    <Page>
      <PageHeading>
        <span
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          css={css`
            cursor: pointer;
          `}
        >
          {hovered ? 'I Break Things' : 'I Make Things'}
        </span>
      </PageHeading>
      <FeaturedWork />
    </Page>
  );
}

export default IndexPage;
