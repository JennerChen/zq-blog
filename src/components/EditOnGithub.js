import React from 'react'
import GithubCorner from 'react-github-corner'
import { StaticQuery, graphql } from 'gatsby'
import { withTheme } from 'styled-components'

const ThemeGithubCorner = withTheme(({ theme, ...githubUserProps }) => {
  let moreGithubProps = {}
  if (theme && theme.mode === 'dark') {
    moreGithubProps.bannerColor = '#70B7FD'
    moreGithubProps.octoColor = '#fff'
  }
  return <GithubCorner {...githubUserProps} {...moreGithubProps} />
})

export default ({ slug }) => {
  let slashCount = slug.split('/').length - 1
  // TODO: 当前没有办法获取slug是否为git目录还是文件，只能通过一种约定判定
  // 1级为目录
  // 2级为文件
  switch (slashCount) {
    case 3:
      slug = slug.substring(0, slug.length - 1) + '.md'
      break
    case 2:
    default:
      slug = slug + 'index.md'
  }

  return (
    <StaticQuery
      query={graphql`
        query GithubUrl {
          site {
            siteMetadata {
              githubUrl
            }
          }
        }
      `}
      render={({
        site: {
          siteMetadata: { githubUrl },
        },
      }) => <ThemeGithubCorner href={`${githubUrl}${slug}`} />}
    />
  )
}
