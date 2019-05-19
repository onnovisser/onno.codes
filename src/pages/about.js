import { css } from '@emotion/core';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import React, { useEffect } from 'react';
import Content from '../components/content';
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
              `}
            >
              <Socials
                css={css`
                  display: flex;
                  justify-content: center;
                  margin-bottom: 20px;
                  ${mq.mediumUp} {
                    order: 1;
                    display: block;
                    margin: 20px 0 0;
                  }
                `}
              />
              <Text>
                Onno Visser is a 29 year old developer born in Delft, The
                Netherlands. As a self-taught programmer with a background in
                User Experience Design, he combines his love of all things web
                to create experiences that connect with users.
              </Text>
            </div>
          </Content>
        </LinedBlock>
      </Content>
    </Page>
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
