// https://github.com/algolia/gatsby-plugin-algolia/blob/master/gatsby-node.js

const algoliasearch = require('algoliasearch')
const report = require('gatsby-cli/lib/reporter')
const appId = process.env.ALGOLIA_APP_ID
const apiKey = process.env.ALGOLIA_API_KEY
const indexName = process.env.ALGOLIA_INDEX_NAME
const skipIndexing = !(appId && apiKey && indexName)

const myQuery = `{
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          tags
        }
        id
        excerpt(pruneLength: 240)
      }
    }
  }
}`

exports.onPostBuild = async function({ graphql }, config) {
  if (skipIndexing === true) {
    report.info('no valid algolia config inject, skip Indexing ')
    return
  }

  const client = algoliasearch(appId, apiKey)

  const index = client.initIndex(indexName)

  try {
    const results = await graphql(myQuery)

    const indexedData = results.data.allMarkdownRemark.edges.map(
      ({ node }) => ({
        objectID: node.id,
        title: node.frontmatter ? node.frontmatter.title : '',
        tags: node.frontmatter ? node.frontmatter.tags : [],
        slug: node.fields.slug,
        //      desc: node.excerpt
      })
    )

    await index.saveObjects(indexedData)

    report.success(`index successfully to ${ indexName.toUpperCase() }`)
  } catch (err) {
    report.panic('failed to index to Algolia', err)
  }
}
