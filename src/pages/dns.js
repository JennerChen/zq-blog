import React, { useMemo, useState } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/Layout'

import DigDomain from '../components/DigDomain'
// https://developers.google.com/speed/public-dns/docs/doh/json
const Container = styled.div`
  padding: 15px;
  flex: 1;
`

const InputSearch = styled.div`
  position: relative;

  input {
    border: 2px solid #ccc;
    background-color: transparent;
    height: 100%;
    width: 100%;
    line-height: 100%;
    padding: 10px 15px;
    border-radius: 5px;
    overflow: hidden;
    font-size: 20px;
    color: var(--BLOG-COLOR);

    ::placeholder {
      color: #969696;
    }

    &:focus {
    }
  }

  button {
    position: absolute;
    right: 0;
    height: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0 20px;
    color: #b2afaf;

    &.active,
    &:hover {
      color: #d74a02;
    }
  }
`

const SearchIcon = styled.svg.attrs({
  viewBox: '0 0 48 48',
})`
  width: 34px;
  fill: currentColor;
  //fill: #b2afaf;
  vertical-align: middle;
`

export default function({ data, location }) {
  const [domainStr, setDomain] = useState('')

  const domain = useMemo(() => {
    if (!domainStr || !domainStr.trim()) return ''
    return /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(domainStr.trim())[1]
  }, [domainStr])

  const siteTitle = data.site.siteMetadata.title
  const siteDescription = data.site.siteMetadata.description

  return (
    <Layout
      tags={data.allMarkdownRemark.group.sort(
        (a, b) => a.totalCount - b.totalCount > 0
      )}
      location={location}
      title={siteTitle}
      meta={[
        {
          name: 'description',
          content: siteDescription,
        },
      ]}
    >
      <Container>
        <h2>dns查询</h2>
        <InputSearch>
          <input
            value={domainStr}
            onChange={e => setDomain(e.target.value)}
            type="text"
            placeholder="Google DNS域名查询"
            autoFocus
            required
          />

          <button className={domain ? 'active' : ''} type="submit">
            <SearchIcon>
              <path d="M31 28h-1.59l-.55-.55C30.82 25.18 32 22.23 32 19c0-7.18-5.82-13-13-13S6 11.82 6 19s5.82 13 13 13c3.23 0 6.18-1.18 8.45-3.13l.55.55V31l10 9.98L40.98 38 31 28zm-12 0c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" />
            </SearchIcon>
          </button>
        </InputSearch>

        <DigDomain domain={domain} />
      </Container>
    </Layout>
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
