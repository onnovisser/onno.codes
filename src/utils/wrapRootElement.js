import { MDXProvider } from '@mdx-js/tag';
import { preToCodeBlock } from 'mdx-utils';
import React from 'react';
import Layout from '../components/layout';
import Heading from '../components/heading';

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <pre {...props} />;
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />;
  },
  h1: (props) => <Heading {...props} as="h1" size={800} />,
  h2: (props) => <Heading {...props} as="h2" size={700} />,
  h3: (props) => <Heading {...props} as="h3" size={600} />,
};

export function wrapRootElement({ element }) {
  return (
    <Layout>
      <MDXProvider components={components}>{element}</MDXProvider>
    </Layout>
  );
}
