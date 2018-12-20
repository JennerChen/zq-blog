import React, { Component } from 'react'
import { Link, graphql, navigate } from 'gatsby'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'
import PostNavButton from '../components/PostNavButton'
import TagList from '../components/TagList'
import media from 'styled-media-query'
const PostTitle = styled.h3`
  color: #333;
  line-height: 2em;

  transition: all 0.3s;
  margin-bottom: ${rhythm(1 / 4)};
  &:hover {
    opacity: 0.61;
  }
`

const PublishDate = styled.span`
  font-size: 0.75em;
  color: #969696;
  padding-right: 1em;
  margin-right: 1em;
  border-right: 1px solid #969696;
`

const PostContainer = styled.div`
  padding-bottom: ${rhythm(20 / 16)};
  border-bottom: 1px solid #d4d4d4;
`

const PostContent = styled.p`
  color: #333;
  font-size: 1em;
`

const HomeNotesListContainer = styled.div`
  margin: 0 auto;
  padding: ${rhythm(1)};
  width: 100%;

  ${media.greaterThan('large')`
      max-width: ${rhythm(38)}
    `};
  
  ${media.between('medium', 'large')`
  max-width: ${rhythm(26)};
  `}
  
  ${media.between('small', 'medium')`
    max-width: ${rhythm(20)}
  `}
  
  ${media.lessThan('small')`
  max-width: ${rhythm(14)}
  `}
`
class PostBrief extends Component {
  render() {
    const {
      node: {
        excerpt,
        fields: { slug },
        frontmatter: { date, title, tags },
      },
    } = this.props
    return (
      <PostContainer>
        <PostTitle>
          <Link style={{ boxShadow: 'none' }} to={slug}>
            {title}
          </Link>
        </PostTitle>
        <PublishDate>{date}</PublishDate> <TagList tags={tags} />
        <PostContent dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div>
          <PostNavButton onClick={() => navigate(slug)}>阅读</PostNavButton>
        </div>
      </PostContainer>
    )
  }
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
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

        <HomeNotesListContainer>
          {posts.map(({ node }) => {
            return <PostBrief key={node.fields.slug} node={node} />
          })}
        </HomeNotesListContainer>
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
          }
        }
      }
    }
  }
`
