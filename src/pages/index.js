import { css, keyframes } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import Page from '../components/page';
import PageHeading from '../components/pageHeading';
import FeaturedWork from '../components/work/featured';
import emitter from '../utils/emitter';

const glitch = keyframes`
  from, 20%, 24.1%, 50%, 52.1%, 56.1%, to {
    text-shadow: 0 0 0 red, 0 0 0 cyan;
    clip: rect(45px,9999px,100px,0);
  }

  20.1%, 22% {
    text-shadow: 0 -4px 0 lime, 4px 4px 0 purple;
  }

  22.1%, 24% {
    text-shadow: -2px -2px 0 yellow, 0 2px 0 blue;
    clip: rect(0,9999px,45px,0);
  }

  50.1%, 52% {
    text-shadow: -2px 0px 0 lime, 2px 0 0 purple;
    clip: rect(0,9999px,45px,0);
  }

  53%, 55% {
    text-shadow: 2px -2px 0 red, -2px 0 0 cyan;
    clip: rect(0,9999px,100px,0);
  }
`;

const glitch2 = keyframes`
  31%, 60%, 91%, 99% {
    text-shadow: 0 0 0 red, 0 0 0 cyan;
    clip: rect(45px,9999px,100px,0);
  }

  from, 30% {
    text-shadow: 2px -1px 0 red, -2px 0 0 cyan;
  }

  61%, 90% {
    /* text-shadow: -2px -2px 0 yellow, 0 2px 0 blue; */
    clip: rect(0,9999px, 100px,0);
  }
`;

function IndexPage() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    emitter.emit('changeExplodeModifier', hovered ? 1 : 0);
  }, [hovered]);

  const word = hovered ? 'Break' : 'Make';

  return (
    <Page>
      <PageHeading>
        <span
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          css={css`
            cursor: pointer;
            padding: 60px 100px;
          `}
        >
          I{' '}
          <span
            data-text={word}
            css={css`
              position: relative;
              display: inline-block;

              &::before {
                content: attr(data-text);
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                color: transparent;
                z-index: -1;
                animation: ${glitch} 6s linear infinite;
              }
              ${hovered &&
                css`
                  &::before {
                    animation: ${glitch2} 0.2s linear forwards;
                  }
                `}
            `}
          >
            {word}
          </span>{' '}
          Things
        </span>
      </PageHeading>
      <FeaturedWork />
    </Page>
  );
}

export default IndexPage;
