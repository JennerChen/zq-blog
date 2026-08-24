import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import LuckyDraw from '../../components/LuckyDraw'

export default function BigplanSuoneLuckDraw({
  data: {
    site: { siteMetadata },
  },
}) {
  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'cn' }}
        title={`幸运抽奖 | ${siteMetadata.title}`}
        meta={[
          {
            name: 'description',
            content: siteMetadata.description,
          },
        ]}
      />

      <LuckyDraw />
    </>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
