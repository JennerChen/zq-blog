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
        title={`问卷幸运抽奖`}
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
