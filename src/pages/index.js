import React from 'react'
import { graphql } from 'gatsby'
import BlogList from '../components/BlogList'
import Layout from '../components/Layout'
import SearchPost from '../components/SearchPost'
class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    return (
      <Layout
        tags={this.props.data.allMarkdownRemark.group.sort(
          (a, b) => a.totalCount - b.totalCount > 0
        )}
        location={this.props.location}
        title={siteTitle}
        meta={[
          {
            name: 'description',
            content: siteDescription,
          },
        ]}
      >
        <BlogList header={<SearchPost />} posts={posts} />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }

    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 240)
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            tags
            commentIdentifier
          }
        }
      }

      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
