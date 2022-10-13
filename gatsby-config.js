require('dotenv').config({
  path: `.env.algolia.${process.env.NODE_ENV}`,
})


const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME

module.exports = {
  siteMetadata: {
    title: '张庆的笔记',
    author: '张庆',
    description: '张庆 笔记 个人工作 张庆的个人工作笔记 博客 日志 技术 前端',
    siteUrl: 'https://zqblog.beaf.tech/',
    githubUrl: 'https://github.com/JennerChen/zq-blog/tree/master/src/pages',
    homeUrl: `https://github.com/JennerChen`,
    icpNumber: `苏ICP备18010722号`,
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {},
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/terminal`,
        name: 'terminal',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: 100,
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill="currentColor" fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              className: `gatsby-remark-link`,
            },
          },
          {
            resolve: 'gatsby-remark-mermaid',
            options: {
              theme: 'default',
              viewport: { height: 800, width: 800 },
              mermaidOptions: {
                themeCSS: `
                  foreignObject { line-height: 19px; }
                  foreignObject div { line-height: 19px; };
                `,
              },
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-reading-time',
        ],
      },
    },
    {
      resolve: `zqblog-search-plugin`,
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
     {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-131289526-1",
          "G-SC3S920350"
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false
        },
      },
    },
    {
      resolve: `gatsby-plugin-baidu-analytics`,
      options: {
        // baidu analytics siteId
        siteId: 'cb7da21041560cf711590015600dd858',
        // Put analytics script in the head instead of the body [default:false]
        head: false,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `张庆的笔记`,
        short_name: `张庆的笔记`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/beaf.logo.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    // offline 插件在chrome中存在缓存bug, 当前无精力修复，暂时移除 #39
    // https://github.com/JennerChen/zq-blog/issues/39
    //    `gatsby-plugin-offline`,
    `gatsby-plugin-remove-serviceworker`,
  ],
}
