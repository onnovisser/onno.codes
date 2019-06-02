import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import React, { useEffect } from 'react';
import Content from '../components/content';
import Heading from '../components/heading';
import LinedBlock from '../components/linedBlock';
import Page from '../components/page';
import PageHeading from '../components/pageHeading';
import Socials from '../components/socials';
import Text from '../components/text';
import mq from '../style/mq';
import emitter from '../utils/emitter';

function AboutPage({ data }) {
  useEffect(() => {
    emitter.emit('changePage', 1);
    return () => {
      emitter.emit('changePage', 0);
    };
  }, []);
  return (
    <Page>
      <PageHeading />
      <Content
        as={LinedBlock}
        noPaddingMobile
        css={css`
          margin-left: -1px;
        `}
      >
        <LinedBlock vertical>
          <Content
            paddingY
            css={css`
              ${mq.mediumUp} {
                display: flex;
                justify-content: space-between;
              }
            `}
          >
            <Image
              fluid={data.file.childImageSharp.fluid}
              fadeIn
              css={css`
                width: 150px;
                height: 150px;
                flex: 1 0 150px;
                border-radius: 50%;
                display: block;
                margin: 0 auto 20px;

                picture img {
                  object-position: center 30% !important;
                }

                ${mq.mediumUp} {
                  width: 200px;
                  height: 200px;
                  flex: 1 0 200px;
                  margin-right: 30px;
                  float: left;
                }
              `}
            />
            <div
              css={css`
                display: flex;
                flex-direction: column;

                > * + * {
                  margin: 3em 0 -2em;
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              `}
            >
              <Socials
                css={css`
                  display: flex;
                  justify-content: center;
                  margin-bottom: -20px;
                  ${mq.mediumUp} {
                    order: 1;
                    display: block;
                    margin: 40px 0 0;
                  }
                `}
              />
              <Text>
                Onno Visser is a 29 year old developer born in Delft, The
                Netherlands. As a self-taught programmer with a background in
                user experience research and design, he uses his love of all
                things web to create experiences that connect with users.
              </Text>
              <Heading size={500}>Commercial toolkit</Heading>
              <TagList>
                {[
                  'Git',
                  'HTML',
                  'CSS',
                  'Sass',
                  'JS',
                  'React',
                  'Redux',
                  'GraphQL',
                  'webpack',
                  'Babel',
                  'Jest',
                  'ThreeJS',
                  'WebGL',
                ].map(tech => (
                  <Tag>{tech}</Tag>
                ))}
              </TagList>
              <Heading size={500}>Knows his way around</Heading>
              <TagList>
                {[
                  'TypeScript',
                  'Node',
                  'MongoDB',
                  'NextJS',
                  'GatsbyJS',
                  'Service Workers',
                  'BackboneJS',
                  'PHP',
                  'Phalcon',
                ].map(tech => (
                  <Tag>{tech}</Tag>
                ))}
              </TagList>
              <Heading size={500}>Dabbled with</Heading>
              <TagList>
                {['Docker', 'Postgres'].map(tech => (
                  <Tag>{tech}</Tag>
                ))}
              </TagList>
            </div>
          </Content>
        </LinedBlock>
      </Content>
    </Page>
  );
}

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
`;

function Tag({ children }) {
  return (
    <Text
      size={200}
      as="li"
      css={({ color }) => css`
        display: inline;
        padding: 5px 10px;
        border: 1px solid ${color.neutralLight};
        border-width: 0 1px 1px 0;
        position: relative;

        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: -1px;
          background-color: ${color.neutralLight};
          z-index: 1;
        }

        &::before {
          width: 100%;
          height: 1px;
        }

        &::after {
          left: -1px;
          width: 1px;
          height: 100%;
        }
      `}
    >
      {children}
    </Text>
  );
}

export const query = graphql`
  query {
    file(relativePath: { eq: "me.jpg" }) {
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
`;
export default AboutPage;
