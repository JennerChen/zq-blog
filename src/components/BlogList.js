import styled, { css } from 'styled-components'
import media from 'styled-media-query'
import { Link, navigate } from 'gatsby'
import { rhythm } from '../utils/typography'
import { Component } from 'react'
import PostNavButton from './PostNavButton'
import React from 'react'
import Tag from '../components/Tag'
import { switchProp } from 'styled-tools'

import { CommentCount } from '../components/Disqus'

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

const ReadingTimeEst = styled.span`
  font-size: 0.75em;
  color: #969696;
  padding-right: 1em;
  margin-right: 1em;
  border-right: 1px solid #969696;
`

const PostContainer = styled.div`
  padding-bottom: ${rhythm(10 / 16)};
  border-bottom: 1px solid #d4d4d4;
`

const PostContent = styled.p`
  font-size: 1em;
  position: relative;
  overflow: hidden;
  ${switchProp('theme.mode', {
    dark: css`
      //color: #fff;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
          rgba(255, 255, 255, 0),
          var(--BLOG-BACKGROUND-COLOR)
        );
      }
    `,
    light: css`
      //color: #333;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
          rgba(255, 255, 255, 0),
          var(--BLOG-BACKGROUND-COLOR)
        );
      }
    `,
  })}
`

const HomeNotesListContainer = styled.div.attrs({
  id: 'posts',
})`
  margin: 0 auto;
  padding: ${rhythm(0.5)};
  width: 100%;
  position: relative;
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

const CommentCountLink = styled(CommentCount)`
  font-size: 0.75em;
  padding-right: 1em;
  margin-right: 1em;
  box-shadow: none;
`

class PostBrief extends Component {
  render() {
    const {
      node: {
        excerpt,
        timeToRead,
        fields: { slug },
        frontmatter: { date, title, tags, commentIdentifier },
      },
    } = this.props

    const identifier = commentIdentifier ? commentIdentifier : title
    return (
      <PostContainer>
        <PostTitle>
          <Link style={{ boxShadow: 'none' }} to={slug}>
            {title}
          </Link>
        </PostTitle>
        <PublishDate>{date}</PublishDate>
        <ReadingTimeEst>约{timeToRead}分钟阅读</ReadingTimeEst>
        <CommentCountLink
          shortname={'zqblog-1'}
          config={{
            identifier,
            url: slug + '#disqus_thread',
            title: title,
          }}
        />
        <div style={{ height: rhythm(0.3) }} />
        {tags ? tags.map(tag => <Tag key={tag} label={tag} />) : null}
        <PostContent dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div>
          <PostNavButton onClick={() => navigate(slug)}>阅读</PostNavButton>
        </div>
      </PostContainer>
    )
  }
}

export default class extends Component {
  render() {
    return (
      <HomeNotesListContainer>
        {this.props.header}
        {this.props.posts.map(({ node }) => {
          return <PostBrief key={node.fields.slug} node={node} />
        })}
      </HomeNotesListContainer>
    )
  }
}
