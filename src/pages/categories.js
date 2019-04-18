import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import Wrapper from '../components/wrapper';
import config from '../config';

const Title = styled.h3`
  position: relative;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.75rem;
`;

const Category = ({
  data: {
    allMdx: { group },
  },
}) => (
  <Wrapper>
    <Helmet title={`Categories | ${config.siteTitle}`} />
    <Link to="/">{config.siteTitle}</Link>

    {group.map(category => (
      <Title key={category.fieldValue}>
        <Link to={`/categories/${kebabCase(category.fieldValue)}`}>
          {category.fieldValue}
        </Link>{' '}
        ({category.totalCount})
      </Title>
    ))}
  </Wrapper>
);

export default Category;

Category.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      group: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

export const postQuery = graphql`
  query CategoriesPage {
    allMdx {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`;
