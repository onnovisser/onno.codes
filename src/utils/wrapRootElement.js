import { css } from '@emotion/core';
import { MDXProvider } from '@mdx-js/react';
import { preToCodeBlock } from 'mdx-utils';
import React from 'react';
import Code from '../components/code';
import Heading from '../components/heading';
import Layout from '../components/layout';
import Text from '../components/text';
import { paddingX, paddingY } from '../style/utils';

function Wrapper(props) {
  return (
    <div
      {...props}
      css={theme => css`
        ${paddingX(theme)}
        ${paddingY(theme)}
        & + & {
          padding-top: 0;
        }
      `}
    />
  );
}

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />;
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />;
  },
  p: props => (
    <Wrapper>
      <Text {...props} />
    </Wrapper>
  ),
  h1: props => (
    <Wrapper>
      <Heading {...props} as="h1" size={800} />
    </Wrapper>
  ),
  h2: props => (
    <Wrapper>
      <Heading {...props} as="h2" size={700} />
    </Wrapper>
  ),
  h3: props => (
    <Wrapper>
      <Heading {...props} as="h3" size={600} />
    </Wrapper>
  ),
};

export function wrapRootElement({ element }) {
  return (
    <Layout>
      <MDXProvider components={components}>{element}</MDXProvider>
    </Layout>
  );
}
