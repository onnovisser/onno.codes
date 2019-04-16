const _ = require('lodash');
const path = require('path');
const fs = require('fs');

// graphql function returns a promise so we can use this little promise helper to have a nice result/error state
const wrapper = promise =>
  promise
    .then(result => ({ result, error: null }))
    .catch(error => ({ error, result: null }));

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  let slug;

  if (node.internal.type === 'Mdx') {
    if (
      Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, 'slug')
    ) {
      slug = `/${_.kebabCase(node.frontmatter.slug)}`;
    }
    if (
      Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, 'title')
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    }
    createNodeField({ node, name: 'slug', value: slug });

    const { frontmatter } = node;
    const parent = getNode(node.parent);
    if (parent.internal.type === 'File') {
      const ext = path.extname(parent.absolutePath);
      const featuredImageJpg = parent.absolutePath.replace(ext, '.jpg');
      const featuredImagePng = parent.absolutePath.replace(ext, '.png');
      const featuredImageWebp = parent.absolutePath.replace(ext, '.webp');
      if (fs.existsSync(featuredImageJpg)) {
        createNodeField({
          name: `featuredImage`,
          node,
          value: featuredImageJpg,
        });
      } else if (fs.existsSync(featuredImagePng)) {
        createNodeField({
          name: `featuredImage`,
          node,
          value: featuredImagePng,
        });
      } else if (fs.existsSync(featuredImageWebp)) {
        createNodeField({
          name: `featuredImage`,
          node,
          value: featuredImageWebp,
        });
      }
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const postTemplate = require.resolve('./src/templates/post.js');
  const categoryTemplate = require.resolve('./src/templates/category.js');

  const { error, result } = await wrapper(
    graphql(`
      {
        allMdx {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                categories
              }
            }
          }
        }
      }
    `)
  );

  if (!error) {
    const posts = result.data.allMdx.edges;

    posts.forEach((edge, index) => {
      const next = index === 0 ? null : posts[index - 1].node;
      const prev = index === posts.length - 1 ? null : posts[index + 1].node;

      createPage({
        path: edge.node.fields.slug,
        component: postTemplate,
        context: {
          slug: edge.node.fields.slug,
          prev,
          next,
        },
      });
    });

    const categorySet = new Set();

    _.each(posts, edge => {
      if (_.get(edge, 'node.frontmatter.categories')) {
        edge.node.frontmatter.categories.forEach(cat => {
          categorySet.add(cat);
        });
      }
    });

    const categories = Array.from(categorySet);

    categories.forEach(category => {
      createPage({
        path: `/categories/${_.kebabCase(category)}`,
        component: categoryTemplate,
        context: {
          category,
        },
      });
    });

    return;
  }

  console.log(error);
};

exports.onCreateWebpackConfig = ({ actions, getConfig, ...rest }) => {
  const config = getConfig();
  // Workaround for issue with worker-loader and HMR
  // See: https://github.com/webpack/webpack/issues/6642
  config.output.globalObject = 'this';

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: [`worker-loader`],
        },
      ],
    },
  });
};
