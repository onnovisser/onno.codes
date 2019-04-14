import { MDXProvider } from '@mdx-js/tag';
import { preToCodeBlock } from 'mdx-utils';
import React from 'react';
import Layout from '../components/layout';

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
};

export function wrapRootElement({ element }) {
  return (
    <Layout>
      <MDXProvider components={components}>{element}</MDXProvider>
    </Layout>
  );
}
