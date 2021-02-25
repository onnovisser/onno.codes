module.exports = {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"

  siteTitle: 'Onno.codes', // Navigation and Site Title
  siteTitleAlt: 'Onno.codes - Personal Portfolio of Onno Visser', // Alternative Site title for SEO
  siteTitleManifest: 'Onno.codes',
  siteUrl: 'https://onno.codes', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteHeadline: 'I make things', // Headline for schema.org JSONLD
  // siteBanner: '/social/banner.jpg', // Your image for og:image tag. You can find it in the /static folder
  favicon: 'src/assets/favicon.png', // Your image for favicons. You can find it in the /src folder
  siteDescription:
    'Onno Visser is a 30 year old developer born in Delft, The Netherlands. As a self-taught programmer with a background in user experience research and design, he uses his love of all things web to create experiences that connect with users.',
  author: 'Onno Visser', // Author for schemaORGJSONLD
  // siteLogo: '/social/logo.png', // Image for schemaORGJSONLD

  userTwitter: '@_onnovisser', // Twitter Username - Optional
  // ogSiteName: 'minimal', // Facebook Site Name - Optional
  ogLanguage: 'en_US', // Facebook Language

  // Manifest and Progress color
  // See: https://developers.google.com/web/fundamentals/web-app-manifest/
  themeColor: '#3498DB',
  backgroundColor: '#2b2e3c',
};
