import React from 'react'
import { graphql, navigate } from 'gatsby'
import Helmet from 'react-helmet'
import GetSuoneCode from '../../components/GetSuoneCode'

export default function SUONECode({
  data: {
    allFile,
    site: { siteMetadata },
  },
}) {
  let basePath = `users/zhangqing`

  console.log(siteMetadata)

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'cn' }}
        title={`SUONE验证码 | ${siteMetadata.title}`}
        meta={[
          {
            name: 'description',
            content: siteMetadata.description,
          },
        ]}
      >
        <link
          rel={'stylesheet'}
          type={'text/css'}
          href={'//at.alicdn.com/t/font_585271_t86bw1k535.css'}
        />
      </Helmet>

      <GetSuoneCode accessToken={siteMetadata.D1_ACCESS_TOKEN} />
    </>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        D1_ACCESS_TOKEN
      }
    }
  }
`
