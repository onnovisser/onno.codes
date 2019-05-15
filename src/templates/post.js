import { graphql, Link } from 'gatsby';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import Content from '../components/content';
import Heading from '../components/heading';
import LinedBlock from '../components/linedBlock';
import { css} from '@emotion/core'
import Page from '../components/page';
import SEO from '../components/seo';
import config from '../config';
import PageHeading from '../components/pageHeading';

const Post = ({
  pageContext: { slug, prev, next },
  data: { mdx: postNode },
}) => {
  const post = postNode.frontmatter;

  return (
    <Page customSEO>
      <PageHeading>{post.title}</PageHeading>
      <SEO postPath={slug} postNode={postNode} article />

      <Link to="/">{config.siteTitle}</Link>

        {post.date} &mdash; {postNode.timeToRead} Min Read &mdash; In{' '}
        {post.categories &&
          post.categories.map((cat, i) => (
            <React.Fragment key={i}>
              {!!i && ', '}
              <Link to={`/categories/${kebabCase(cat)}`}>{cat}</Link>
            </React.Fragment>
          ))}
        <Content narrow noPaddingMobile>
          <LinedBlock>
            <LinedBlock vertical css={css`
              margin-left: -1px;
            `}>
              <MDXRenderer>{postNode.code.body}</MDXRenderer>
            </LinedBlock>
          </LinedBlock>
        </Content>
    </Page>
  );
};

export default Post;

Post.propTypes = {
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    next: PropTypes.object,
    prev: PropTypes.object,
  }),
  data: PropTypes.shape({
    mdx: PropTypes.object.isRequired,
  }).isRequired,
};

Post.defaultProps = {
  pageContext: PropTypes.shape({
    next: null,
    prev: null,
  }),
};

export const postQuery = graphql`
  query postBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      code {
        body
      }
      excerpt
      frontmatter {
        title
        date(formatString: "MM/DD/YYYY")
        categories
      }
      timeToRead
      parent {
        ... on File {
          mtime
          birthtime
        }
      }
    }
  }
`;
