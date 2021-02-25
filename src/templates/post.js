import { css } from '@emotion/core';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import React from 'react';
import Content from '../components/content';
import LinedBlock from '../components/linedBlock';
import Page from '../components/page';
import PageHeading from '../components/pageHeading';
import SEO from '../components/seo';

function Post({ pageContext: { slug, prev, next }, data: { mdx: postNode } }) {
  const post = postNode.frontmatter;

  return (
    <Page customSEO>
      <PageHeading>{post.title}</PageHeading>
      <SEO postPath={slug} postNode={postNode} article />
      <Content narrow noPaddingMobile>
        <LinedBlock>
          <LinedBlock
            vertical
            css={css`
              margin-left: -1px;
            `}
          >
            <MDXRenderer>{postNode.code.body}</MDXRenderer>
          </LinedBlock>
        </LinedBlock>
      </Content>
    </Page>
  );
}

export default Post;

export const postQuery = graphql`
  query postBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "MM/DD/YYYY")
        categories
      }
      parent {
        ... on File {
          mtime
          birthtime
        }
      }
    }
  }
`;
