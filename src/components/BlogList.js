import styled from 'styled-components'
import media from 'styled-media-query'
import { Link, navigate } from 'gatsby'
import { rhythm } from '../utils/typography'
import { Component } from 'react'
import TagList from './TagList'
import PostNavButton from './PostNavButton'
import React from 'react'

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

const HomeNotesListContainer = styled.div.attrs({
  id: 'posts',
})`
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

export default class extends Component {
  render() {
    return (
      <HomeNotesListContainer>
        {this.props.posts.map(({ node }) => {
          return <PostBrief key={node.fields.slug} node={node} />
        })}
      </HomeNotesListContainer>
    )
  }
}
