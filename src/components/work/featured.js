import { css } from '@emotion/core';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import get from 'lodash/get';
import React, { Fragment } from 'react';
import mq from '../../style/mq';
import { paddingY } from '../../style/utils';
import Content from '../content';
import Heading from '../heading';
import ArrowRightIcon from '../icon/arrowRight';
import ExternalIcon from '../icon/external';
import LinedBlock from '../linedBlock';
import LinedColumns, { Column } from '../linedColumns';

const button = ({ color }) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  color: ${color.neutralDark};

  svg {
    margin-left: 10px;
  }
`;

function FeaturedWork() {
  const data = useStaticQuery(query);
  const work = get(data, 'allMdx.edges');

  return (
    <>
      <LinedBlock
        css={css`
          height: 10vh;
          display: flex;
          align-items: center;
        `}
      >
        <Content>
          <Heading>Work</Heading>
        </Content>
      </LinedBlock>
      {work.map(({ node }, i) => {
        const title = get(node, 'frontmatter.title') || node.fields.slug;
        const shortTitle = get(node, 'frontmatter.shortTitle') || title;
        const themeColor = get(node, 'frontmatter.themeColor') || '#0f0';
        const image = get(node, 'fields.featuredImage.childImageSharp.fluid');

        return (
          <Fragment key={node.fields.slug}>
            <Content noPaddingMobile borderRight={i % 2 === 0} borderLeft>
              <LinedColumns flipped={i % 2}>
                <Column>
                  <Heading
                    css={css`
                      position: sticky;
                      top: 10vh;
                      bottom: 0;
                      color: ${themeColor};
                      font-size: 5rem;
                      font-weight: 700;
                      opacity: 0.8;
                      line-height: 1;
                      transform: translateY(0.25em);

                      ${mq.mediumUp} {
                        transform: none;
                        line-height: 0.5;
                        writing-mode: tb-rl;
                      }
                    `}
                  >
                    {shortTitle}
                  </Heading>
                </Column>
                <Column>
                  <LinedBlock
                    css={css`
                      min-height: 80vh;
                      display: flex;
                      flex-direction: column;
                    `}
                  >
                    {image && <Image fluid={image} />}
                    <Content
                      css={theme => css`
                        ${paddingY(theme)};

                        > * + * {
                          margin-top: 1em;
                        }
                      `}
                    >
                      <Heading as="h3">{title}</Heading>
                      <p>{node.frontmatter.description}</p>
                    </Content>
                    <LinedColumns
                      css={css`
                        margin-top: auto;
                      `}
                    >
                      <Column>
                        <LinedBlock
                          as={Link}
                          to={node.fields.slug}
                          css={button}
                        >
                          Read more <ArrowRightIcon />
                        </LinedBlock>
                      </Column>
                      <Column>
                        <LinedBlock
                          as="a"
                          href={node.frontmatter.url}
                          target="blank"
                          rel="noopener noreferrer"
                          css={button}
                        >
                          Visit <ExternalIcon />
                        </LinedBlock>
                      </Column>
                    </LinedColumns>
                  </LinedBlock>
                </Column>
              </LinedColumns>
            </Content>
            {i < work.length - 1 ? (
              <div
                css={css`
                  height: 10vh;
                `}
              />
            ) : (
              <LinedBlock
                css={css`
                  height: 10vh;
                  display: flex;
                  align-items: center;
                `}
              >
                <Content>
                  <Link to="/work">
                    <Heading as="h3">
                      More work <ArrowRightIcon />
                    </Heading>
                  </Link>
                </Content>
              </LinedBlock>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

const query = graphql`
  {
    allMdx(
      limit: 4
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
            url
            title
            shortTitle
            date(formatString: "DD MMMM, YYYY")
            categories
            themeColor
            description
          }
          # excerpt(pruneLength: 200)
          # timeToRead
        }
      }
    }
  }
`;

export default FeaturedWork;
