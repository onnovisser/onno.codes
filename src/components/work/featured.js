import { css } from '@emotion/core';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import get from 'lodash/get';
import React from 'react';
import LinedBlock from '../LinedBlock';
import SplitContent from '../SplitContent';

function FeaturedWork() {
  const data = useStaticQuery(query);
  const posts = get(data, 'allMdx.edges');

  return (
    <>
      <LinedBlock
        css={css`
          height: 10vh;
        `}
      />
      {posts.map(({ node }, i) => {
        const title = get(node, 'frontmatter.title') || node.fields.slug;
        const shortTitle = get(node, 'frontmatter.shortTitle') || title;
        const themeColor = get(node, 'frontmatter.themeColor') || '#0f0';
        console.log(node.frontmatter);
        return (
          <React.Fragment key={node.fields.slug}>
            <SplitContent
              flipped={i % 2}
              left={
                <h3
                  css={css`
                    writing-mode: tb-rl;
                    position: sticky;
                    top: 10vh;
                    bottom: 0;
                    color: ${themeColor};
                    font-size: 5rem;
                    opacity: 0.8;
                    transform: translateX(-0.155em);
                    line-height: 1;
                  `}
                >
                  {shortTitle}
                </h3>
              }
              right={
                <div
                  css={css`
                    min-height: 90vh;
                  `}
                >
                  {node.fields.featuredImage && (
                    <Image
                      fluid={node.fields.featuredImage.childImageSharp.fluid}
                    />
                  )}
                  <h3>
                    <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                  <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                </div>
              }
            />
            <LinedBlock
              css={css`
                height: 10vh;
              `}
            />
          </React.Fragment>
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
        frontmatter: { published: { eq: true }, featured: { eq: true } }
      }
    ) {
      edges {
        node {
          fields {
            slug
            featuredImage {
              childImageSharp {
                fluid {
                  sizes
                  base64
                  aspectRatio
                  src
                  srcSetWebp
                  srcSet
                }
              }
            }
          }
          frontmatter {
            title
            shortTitle
            date(formatString: "DD MMMM, YYYY")
            categories
            themeColor
          }
          excerpt(pruneLength: 200)
          timeToRead
        }
      }
    }
  }
`;

export default FeaturedWork;
