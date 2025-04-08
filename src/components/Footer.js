import { StaticQuery, graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  height: 100px;
  line-height: 100px;
`

const IconButton = styled.a`
  cursor: pointer;
  text-decoration: none;
  box-shadow: none;

  color: #969696;
  transition: all 0.3s;
  margin-right: 1.2em;

  & > i {
    font-size: 2em;
  }
`

export default ({}) => {
  return (
    <StaticQuery
      query={graphql`
        query FooterInfo {
          site {
            siteMetadata {
              homeUrl
              icpNumber
            }
          }
        }
      `}
      render={({
        site: {
          siteMetadata: { homeUrl, icpNumber },
        },
      }) => (
        <FooterContainer>
          Follow me on{' '}
          <IconButton href={homeUrl} target={'_blank'} title={'github'}>
            <i className={'iconfont icon-github'} />
          </IconButton>
          <IconButton
            href={`https://beian.miit.gov.cn`}
            target={'_blank'}
            title={`ICP证`}
          >
            {icpNumber}
          </IconButton>
        </FooterContainer>
      )}
    />
  )
}
