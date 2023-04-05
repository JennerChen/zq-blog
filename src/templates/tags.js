import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import BlogList from '../components/BlogList'
// Components
import { Link, graphql } from 'gatsby'
import styled from 'styled-components'

const HighlightSpan = styled.span`
  color: red;
`

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark

  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout sideBar={false} location={location} title={siteTitle}>
      <BlogList
        header={
          <h1>
            共找到<HighlightSpan>{totalCount}</HighlightSpan>篇关于主题:
            <HighlightSpan>{tag}</HighlightSpan> 的文章{' '}
          </h1>
        }
        posts={edges}
      />
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              //              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default class extends Component {
  render() {
    const { pageContext, data, location } = this.props
    const { tag } = pageContext
    const { edges, totalCount } = data.allMarkdownRemark

    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout sideBar={false} location={location} title={siteTitle}>
        <BlogList
          header={
            <h1>
              共找到<HighlightSpan>{totalCount}</HighlightSpan>篇关于主题:
              <HighlightSpan>{tag}</HighlightSpan> 的文章{' '}
            </h1>
          }
          posts={edges}
        />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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
    }
  }
`
