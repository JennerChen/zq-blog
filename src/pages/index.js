import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import BlogList from '../components/BlogList'
import Layout from '../components/Layout'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    return (
      <Layout
        tags={this.props.data.allMarkdownRemark.group}
        location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        >
          <link
            rel={'stylesheet'}
            type={'text/css'}
            href={'//at.alicdn.com/t/font_585271_6fnuvd8aj0d7k3xr.css'}
          />
        </Helmet>

        <BlogList posts={posts} />
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
