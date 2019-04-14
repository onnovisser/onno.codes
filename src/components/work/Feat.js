import { css } from '@emotion/core';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import get from 'lodash/get';
import React from 'react';
import mq from '../../style/mq';
import BorderedContent from '../BorderedContent';
import Content from '../Content';
import LinedBlock from '../LinedBlock';
import SplitColumns from '../SplitColumns';

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
        return (
          <React.Fragment key={node.fields.slug}>
            <BorderedContent>
              <SplitColumns
                flipped={i % 2}
                left={
                  <div
                    css={css`
                    height: 100%;
                    position: relative;
                    &::before {
                      content: '';
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0;
                      top: 0;
                      /* background-color: ${themeColor}; */
                      opacity: 0.7;
                      z-index: 0;
                    }
                  `}
                  >
                    <h3
                      css={({ color }) => css`
                      position: sticky;
                      top: 10vh;
                      bottom: 0;
                      color: ${themeColor};
                      /* color: ${color.neutralLightest};
                      color: ${color.neutralDark}; */
                      font-size: 5rem;
                      opacity: 0.8;

                      line-height: 1;
    transform: translateY(0.155em);

                      ${mq.mediumUp} {
                      transform: none;
                      line-height: .66;
                        writing-mode: tb-rl;
                      }
                    `}
                    >
                      <span>{shortTitle}</span>
                      <svg
                        css={css`
                          /* width: 100%;
                    height: 100%; */
                          visibility: hidden;
                          position: absolute;
                          left: 0;
                          top: 0;
                        `}
                      >
                        <rect
                          width="100%"
                          height="100%"
                          fill="#000"
                          x="0"
                          y="0"
                          fill-opacity="1"
                          mask="url(#knockout-text)"
                        />

                        <mask id="knockout-text">
                          <rect
                            width="100%"
                            height="100%"
                            fill="#fff"
                            x="0"
                            y="0"
                          />
                          <text x="0" y="0" fill="#000">
                            {shortTitle}
                          </text>
                        </mask>
                      </svg>
                    </h3>
                  </div>
                }
                right={
                  <LinedBlock
                    css={css`
                      min-height: 90vh;
                    `}
                  >
                    {node.fields.featuredImage && (
                      <Image
                        fluid={node.fields.featuredImage.childImageSharp.fluid}
                      />
                    )}
                    <Content>
                      <h3>
                        <Link
                          style={{ boxShadow: 'none' }}
                          to={node.fields.slug}
                        >
                          {title}
                        </Link>
                      </h3>
                      <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                    </Content>
                  </LinedBlock>
                }
              />
            </BorderedContent>
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
