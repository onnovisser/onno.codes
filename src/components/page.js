import { css } from '@emotion/core';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import SEO from './SEO';

Page.defaultProps = {
  customSEO: false,
};

function Page({ children, customSEO }) {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        buildTime(formatString: "YYYY-MM-DD")
      }
    }
  `);
  return (
    <>
      {!customSEO && <SEO buildTime={data.site.buildTime} />}
      {children}
      <footer
        css={css`
          text-align: center;
          padding: 3rem 1rem;
          span {
            font-size: 0.75rem;
          }
        `}
      >
        &copy; 2019 by John Doe. All rights reserved. <br />
        <a href="https://github.com/LekoArts/gatsby-starter-minimal-blog">
          GitHub Repository
        </a>
      </footer>
    </>
  );
}
export default Page;
