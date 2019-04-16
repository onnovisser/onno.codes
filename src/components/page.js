import { css } from '@emotion/core';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import SEO from './seo';

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
          font-size: 0.75rem;
        `}
      >
        {/* &copy; 2019 by Onno Visser */}
      </footer>
    </>
  );
}
export default Page;
