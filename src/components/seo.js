import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import config from '../config';

SEO.propTypes = {
  postNode: PropTypes.object,
  postPath: PropTypes.string,
  article: PropTypes.bool,
  buildTime: PropTypes.string,
};

SEO.defaultProps = {
  postNode: null,
  postPath: null,
  article: false,
  buildTime: null,
};

function SEO({ postNode, postPath, article, buildTime }) {
  let title;
  let description;

  const realPrefix = config.pathPrefix === '/' ? '' : config.pathPrefix;
  const homeURL = `${config.siteUrl}${realPrefix}`;
  const URL = `${homeURL}${postPath || ''}`;
  const image = `${homeURL}${config.siteBanner}`;

  if (article) {
    const postMeta = postNode.frontmatter;
    title = `${postMeta.title} | ${config.siteTitle}`;
    description = postNode.excerpt;
  } else {
    title = config.siteTitleAlt;
    description = config.siteDescription;
  }

  // schema.org in JSONLD format
  // https://developers.google.com/search/docs/guides/intro-structured-data
  // You can fill out the 'author', 'creator' with more data or another type (e.g. 'Organization')

  const schemaOrgWebPage = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: URL,
    headline: config.siteHeadline,
    inLanguage: config.siteLanguage,
    mainEntityOfPage: URL,
    description: config.siteDescription,
    name: config.siteTitle,
    author: {
      '@type': 'Person',
      name: config.author,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: config.author,
    },
    copyrightYear: '2018',
    creator: {
      '@type': 'Person',
      name: config.author,
    },
    publisher: {
      '@type': 'Person',
      name: config.author,
    },
    datePublished: '2019-01-07T10:30:00+01:00',
    dateModified: buildTime,
    // image: {
    //   '@type': 'ImageObject',
    //   url: image,
    // },
  };

  // Initial breadcrumb list

  const itemListElement = [
    {
      '@type': 'ListItem',
      item: {
        '@id': homeURL,
        name: 'Homepage',
      },
      position: 1,
    },
    {
      '@type': 'ListItem',
      item: {
        '@id': `${homeURL}/contact`,
        name: 'Contact',
      },
      position: 2,
    },
  ];

  let schemaArticle = null;

  if (article) {
    schemaArticle = {
      '@context': 'http://schema.org',
      '@type': 'Article',
      author: {
        '@type': 'Person',
        name: config.author,
      },
      copyrightHolder: {
        '@type': 'Person',
        name: config.author,
      },
      copyrightYear: postNode.parent.birthtime,
      creator: {
        '@type': 'Person',
        name: config.author,
      },
      publisher: {
        '@type': 'Organization',
        name: config.author,
        // logo: {
        //   '@type': 'ImageObject',
        //   url: `${homeURL}${config.siteLogo}`,
        // },
      },
      datePublished: postNode.parent.birthtime,
      dateModified: postNode.parent.mtime,
      description,
      headline: title,
      inLanguage: 'en',
      url: URL,
      name: title,
      image: {
        '@type': 'ImageObject',
        url: image,
      },
      mainEntityOfPage: URL,
    };
    // Push current blogpost into breadcrumb list
    itemListElement.push({
      '@type': 'ListItem',
      item: {
        '@id': URL,
        name: title,
      },
      position: 3,
    });
  }

  const breadcrumb = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    description: 'Breadcrumbs list',
    name: 'Breadcrumbs',
    itemListElement,
  };

  return (
    <Helmet
      title={title}
      htmlAttributes={{ lang: config.siteLanguage }}
      meta={[
        { name: 'description', content: description },
        { name: 'name', content: image },
        { property: 'og:locale', content: config.ogLanguage },
        config.ogSiteName && {
          property: 'og:site_name',
          content: config.ogSiteName,
        },
        { property: 'og:url', content: URL },
        { property: 'og:type', content: article ? 'article' : 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:image:alt', content: description },
        { property: 'twitter:card', content: 'summary_large_image' },
        {
          property: 'twitter:creator',
          content: config.userTwitter ? config.userTwitter : '',
        },
        { name: 'twitter:title', content: title },
        { name: 'twitter:url', content: config.siteUrl },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        { name: 'twitter:image:alt', content: description },
      ].filter(Boolean)}
      script={[
        // Insert schema.org data conditionally (webpage/article) + everytime (breadcrumbs)
        {
          type: 'application/ld+json',
          innerHTML: article
            ? JSON.stringify(schemaArticle)
            : JSON.stringify(schemaOrgWebPage),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumb),
        },
      ]}
    />
  );
}

export default SEO;
