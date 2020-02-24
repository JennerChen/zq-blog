import React from 'react'
import PropTypes from 'prop-types'

// Components
import { graphql } from 'gatsby'
import Tag from '../../components/Tag'
import Layout from '../../components/Layout'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => (
  <Layout sideBar={false} location={location} title={title}>
    <>
      <h1>Tags</h1>
      <ul>
        {group
          .sort((a, b) => {
            if (a.totalCount - b.totalCount === 0) return 0
            return a.totalCount - b.totalCount > 0 ? -1 : 1
          })
          .map(tag => (
            <li key={tag.fieldValue}>
              <Tag
                alwaysShow={true}
                label={tag.fieldValue}
                count={tag.totalCount}
              />
            </li>
          ))}
      </ul>
    </>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
