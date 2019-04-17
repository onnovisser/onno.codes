import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import config from '../config';

const Content = styled.div`
  grid-column: 2;
  box-shadow: 0 4px 120px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 2rem 4rem;
  background-color: ${props => props.theme.color.bg};
  z-index: 9000;
  margin-top: -3rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 3rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1.5rem;
  }
`;

const Category = ({ pageContext: { category }, data: { allMdx } }) => {
  const { edges, totalCount } = allMdx;
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

Category.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.array.isRequired,
      totalCount: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

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
