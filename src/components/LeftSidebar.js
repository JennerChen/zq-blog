import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { rhythm, scale } from '../utils/typography'
import media from 'styled-media-query'
import Tag from './Tag'

const Container = styled.div`
  display: flex;
  background: #333;
  width: 400px;
  flex-shrink: 0;
  padding: ${rhythm(1.5)} ${rhythm(1)};
  flex-direction: column;

  ${media.lessThan('large')`
    display: none;
  `};
`

const MyName = styled.h2`
  color: #fff;
`

const StickWrap = styled.div`
  position: sticky;
  top: 0;
`

const Desc = styled.p`
  color: #9b9b9b;
  font-size: 1em;
`

const Divider = styled.div`
  height: 1px;
  background-color: #9b9b9b;
  width: 200px;
  margin-top: 15px;
  margin-bottom: 15px;
`

const StyledLink = styled(Link)`
  color: #969696;
  transition: all 0.3s;
  font-size: 1.2em;

  text-decoration: none;
  box-shadow: none;

  &:hover {
    color: #fff;
  }
`

const IconButton = styled.a`
  cursor: pointer;
  text-decoration: none;
  box-shadow: none;

  color: #969696;
  transition: all 0.3s;
  margin-right: 1.2em;

  & > i {
    font-size: 1em;
  }

  &:hover {
    color: #fff;
  }
`

export default class extends Component {
  render() {
    let tags = (this.props.tags ? this.props.tags : []).sort((a, b) => {
      if (a.totalCount - b.totalCount === 0) return 0
      return a.totalCount - b.totalCount > 0 ? -1 : 1
    })

    return (
      <Container>
        <StickWrap>
          <MyName>Zhang Qing</MyName>
          <Desc>
            Hi, 我是张庆。一名前端程序员, 这是我记录工作中的笔记📒,
            主要为前端技术问题。不求精品, 只求实用
          </Desc>

          <Divider />

          <div>
            <StyledLink to={'/'}>主页</StyledLink>
          </div>

          {/*<Divider />*/}

          <div style={ { marginTop: ".6em" } }>
            {/*最多只显示20个*/}
            {tags.slice(0,20).map(({ fieldValue, totalCount }) => (
              <Tag
                alwaysShow={true}
                key={fieldValue}
                label={fieldValue}
                count={totalCount}
              />
            ))}
          </div>

          <Divider />

          <IconButton
            href={'https://github.com/JennerChen'}
            target={'_blank'}
            title={'github'}
          >
            <i className={'iconfont icon-github'} />
          </IconButton>

          <IconButton
            href={'https://www.linkedin.com/in/zhangqing332/'}
            target={'_blank'}
            title={'linkedin'}
          >
            <i className={'iconfont icon-linkedin'} />
          </IconButton>

          <IconButton
            href={'https://zq.beaf.tech/'}
            target={'_blank'}
            title={'个人介绍'}
          >
            <i className={'iconfont icon-resume'} />
          </IconButton>

          <IconButton
            href={'/rss.xml'}
            target={'_blank'}
            title={'rss'}
          >
            <i className={'iconfont icon-rss'} />
          </IconButton>
        </StickWrap>
      </Container>
    )
  }
}
