import React from 'react'
import { graphql, navigate } from 'gatsby'
import Terminal from '../../components/Terminal'
import Helmet from 'react-helmet'

export default function({
  data: {
    allFile,
    site: { siteMetadata },
  },
}) {
  let basePath = `users/zhangqing`
  let files = []
  let folds = []

  allFile.edges.forEach(({ node: file }) => {
    if (file.relativeDirectory) {
      if (!folds.includes(file.relativeDirectory)) {
        folds.push(file.relativeDirectory)
      }
    }

    files.push({
      name: file.name + file.ext,
      content: () => fetch(file.publicURL).then(data => data.text()),
      dir: file.relativeDirectory ? file.relativeDirectory : undefined,
      path: basePath + '/' + file.relativePath,
    })
  })

  files = [
    ...folds.map(path => {
      let pathArr = path.split('/')
      let dir = pathArr.slice(0, pathArr.length - 1).join('/')
      return {
        name: pathArr[pathArr.length - 1],
        dir: dir,
        path: basePath + '/' + path,
      }
    }),
    ...files,
  ]

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'cn' }}
        title={`我的命令行 |${siteMetadata.title}`}
        meta={[
          {
            name: 'description',
            content: siteMetadata.description,
          },
          {
            name: 'description',
            content: `张庆 我的 命令行 Terminal`,
          },
        ]}
      >
        <link
          rel={'stylesheet'}
          type={'text/css'}
          href={'//at.alicdn.com/t/font_585271_t86bw1k535.css'}
        />
      </Helmet>

      <Terminal
        onClose={() => navigate('/')}
        files={files}
        basePath={basePath}
      />
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

    allFile(filter: { sourceInstanceName: { eq: "terminal" } }) {
      edges {
        node {
          publicURL
          ext
          name
          relativePath
          relativeDirectory
        }
      }
    }

    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 240)
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            tags
            commentIdentifier
          }
        }
      }

      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
