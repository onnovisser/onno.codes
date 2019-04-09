import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../config';
import Layout from '../components/layout';

const Content = styled.article`
  grid-column: 2;
  box-shadow: 0 4px 120px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  border-radius: 1rem;
  padding: 2rem 4.5rem;
  background-color: ${props => props.theme.colors.bg};
  z-index: 9000;
  margin-top: -3rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 3rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1.5rem;
  }
  p {
    font-size: 1.1rem;
    letter-spacing: -0.003em;
    line-height: 1.58;
    --baseline-multiplier: 0.179;
    --x-height-multiplier: 0.35;
    @media (max-width: ${props => props.theme.breakpoints.phone}) {
      font-size: 1rem;
    }
  }

  .prism-code {
    padding: 0.75rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    font-size: 16px;
  }
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const PostContent = styled.div`
  margin-top: 4rem;
`;

const Post = ({
  pageContext: { slug, prev, next },
  data: { mdx: postNode },
}) => {
  const post = postNode.frontmatter;

  return (
    <Layout customSEO>
      <Wrapper>
        <SEO postPath={slug} postNode={postNode} article />
       
          <Link to="/">{config.siteTitle}</Link>

        <Content>
          <Title>{post.title}</Title>
          {post.date} &mdash; {postNode.timeToRead} Min Read &mdash; In{' '}
          {post.categories.map((cat, i) => (
            <React.Fragment key={cat}>
              {!!i && ', '}
              <Link to={`/categories/${kebabCase(cat)}`}>{cat}</Link>
            </React.Fragment>
          ))}
          <PostContent>
            <MDXRenderer>{postNode.code.body}</MDXRenderer>
          </PostContent>
        </Content>
      </Wrapper>
    </Layout>
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
