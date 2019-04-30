import { css } from '@emotion/core';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import get from 'lodash/get';
import React from 'react';
import mq from '../../style/mq';
import Content from '../content';
import Heading from '../heading';
import LinedBlock from '../linedBlock';
import Text from '../text';

function FeaturedWork() {
  const data = useStaticQuery(query);
  const posts = get(data, 'allMdx.edges');

  return (
    <>
      <Content
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-left: -1px;

          ${mq.mediumUp} {
            margin-left: 0;
            grid-gap: 5vh;
          }

          ${mq.largeUp} {
            grid-template-columns: 1fr 1fr 1fr;
          }
        `}
        noPaddingMobile
      >
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug;
          const image = get(node, 'fields.featuredImage.childImageSharp.fluid');
          return (
            <LinedBlock
              as="a"
              href={node.frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              key={node.fields.slug}
            >
              <LinedBlock
                vertical
                css={css`
                  height: 100%;
                `}
              >
                {image && (
                  <Image fluid={{ ...image, aspectRatio: 1.2 }} fadeIn />
                )}
                <div
                  css={css`
                    padding: 10px;
                  `}
                >

                  <Heading as="h2" size={300}>{title}             <Text size={200} variant="display" as="time" dateTime={node.frontmatter.timestamp}>({node.frontmatter.year})</Text></Heading>
                  {/* <p>{node.frontmatter.description}</p> */}
                </div>
              </LinedBlock>
            </LinedBlock>
          );
        })}
      </Content>
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
            url
            year:date(formatString: "YYYY")
            timestamp:date
            categories
            themeColor
            description
          }
        }
      }
    }
  }
`;

export default FeaturedWork;
