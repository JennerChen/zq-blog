import React from 'react'
import { Link, graphql } from 'gatsby'
import media from 'styled-media-query'
import styled, { css } from 'styled-components'
import { switchProp } from 'styled-tools'
import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'
import CopyRightInfo from '../components/CopyRightInfo'
import { DiscussionEmbed } from '../components/Disqus'
import Tag from '../components/Tag'
import DayNightSwitch from '../components/DayNightSwitch'
import EditOnGithub from '../components/EditOnGithub'
const PostTitle = styled.h1`
  line-height: 1em;
  transition: all 0.3s;
  margin-bottom: ${rhythm(1 / 4)};
  margin-top: 0;
  cursor: default;
  ${switchProp('theme.mode', {
    light: css`
      color: #333;
    `,
  })};
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

const ReadingTimeEst = styled.span`
  font-size: 0.75em;
  color: #969696;
  padding-right: 1em;
  margin-right: 1em;
  border-right: 1px solid #969696;
`

const MarkDownContainer = styled.div`
  margin: 0 auto;
  padding: ${rhythm(1)};
  width: 100%;


	.mermaid {
		display: flex;
		justify-content: center;
    background-color: #fff;
	}

  ${media.greaterThan('large')`
      max-width: ${rhythm(38)};
      padding: ${rhythm(1)};
    `};
  
  ${media.between('medium', 'large')`
  max-width: ${rhythm(26)};
  padding: ${rhythm(0.8)};
  `}
  
  ${media.between('small', 'medium')`
    max-width: ${rhythm(20)};
      padding: ${rhythm(0.6)};

  `}
  
  ${media.lessThan('small')`
  max-width: ${rhythm(14)};
  padding: ${rhythm(0.4)};
  `}
`

class PostContent extends React.PureComponent {
  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.children }} />
  }
}

class BlogPostTemplate extends React.Component {
  state = {
    mode: 'light',
  }

  componentDidMount() {
    // ssr 不会执行
    if (
      localStorage.getItem('theme') &&
      localStorage.getItem('theme') !== this.state.mode
    ) {
      console.log(`use theme ${this.state.mode}`)
      this.setState({
        mode: localStorage.getItem('theme'),
      })
    }
  }

  toggleDarkMode = bool => {
    localStorage.setItem('theme', bool ? 'light' : 'dark')
    this.setState({ mode: bool ? 'light' : 'dark' })
  }

  render() {
    const post = this.props.data.markdownRemark
    const siteMetadata = this.props.data.site.siteMetadata
    const siteTitle = siteMetadata.title
    const original = post.frontmatter.original
    const { previous, next } = this.props.pageContext
    const title = `${post.frontmatter.title} | ${siteTitle}`
    const identifier = post.frontmatter.commentIdentifier
      ? post.frontmatter.commentIdentifier
      : post.frontmatter.title
    const tags = post.frontmatter.tags ? post.frontmatter.tags : []
    return (
      <Layout
        tags={this.props.data.allMarkdownRemark.group}
        location={this.props.location}
        title={title}
        meta={[
          { name: 'description', content: siteMetadata.title },
          { name: 'description', content: siteMetadata.description },
          { name: 'description', content: tags.join(' ') },
          { name: 'description', content: post.excerpt },
        ]}
        theme={this.state.mode}
      >
        <div>
          <DayNightSwitch
            checked={this.state.mode === 'light'}
            onChange={val => this.toggleDarkMode(val)}
          />

          <EditOnGithub slug={this.props.pageContext.slug} />
        </div>
        <MarkDownContainer>
          <PostTitle>{post.frontmatter.title}</PostTitle>
          <PublishDate>{post.frontmatter.date}</PublishDate>
          <ReadingTimeEst>约{post.timeToRead}分钟阅读</ReadingTimeEst>

          {tags.map(tag => (
            <Tag key={tag} label={tag} />
          ))}
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <CopyRightInfo original={original} />

          <hr style={{ marginBottom: rhythm(0.5) }} />

          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
              marginLeft: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>

          <hr style={{ marginTop: rhythm(0.5) }} />

          <DiscussionEmbed
            shortname={'zqblog-1'}
            config={{ identifier, title }}
          />
        </MarkDownContainer>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        description
      }
    }

    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        original
        commentIdentifier
      }
      fields {
        readingTime {
          time
          words
          text
        }
      }
    }
  }
`
