import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import config from '../config';

function Category({ pageContext: { category }, data: { allMdx } }) {
  const { totalCount } = allMdx;
  const subline = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${category}"`;

  return (
    <>
      <Helmet title={`Category: ${category} | ${config.siteTitle}`} />
      <Link to="/">{config.siteTitle}</Link>
      {subline} (See <Link to="/categories">all categories</Link>)
      {/* {edges.map(post => (
        <Article
          title={post.node.frontmatter.title}
          date={post.node.frontmatter.date}
          excerpt={post.node.excerpt}
          timeToRead={post.node.timeToRead}
          slug={post.node.fields.slug}
          categories={post.node.frontmatter.categories}
          key={post.node.fields.slug}
        />
      ))} */}
    </>
  );
};

export default Category;

export const postQuery = graphql`
  query CategoryPage($category: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { eq: $category } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MM/DD/YYYY")
            categories
          }
          fields {
            slug
          }
          excerpt(pruneLength: 200)
          timeToRead
        }
      }
    }
  }
`;
