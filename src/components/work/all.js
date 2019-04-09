import { graphql, Link, useStaticQuery } from 'gatsby';
import get from 'lodash/get';
import React from 'react';

function FeaturedWork() {
  const data = useStaticQuery(query);
  const posts = get(data, 'allMdx.edges');

  return (
    <>
      {posts.map(({ node }) => {
        const title = get(node, 'frontmatter.title') || node.fields.slug;
        return (
          <div key={node.fields.slug}>
            <h3>
              <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                {title}
              </Link>
            </h3>
            <small>{node.frontmatter.date}</small>
            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          </div>
        );
      })}
    </>
  );
}

const query = graphql`
  {
    allMdx(
      limit: 40
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        # fields: { type: { eq: "work" } }
        frontmatter: { published: { eq: true } }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            categories
          }
          excerpt(pruneLength: 200)
          timeToRead
        }
      }
    }
  }
`;

export default FeaturedWork;
