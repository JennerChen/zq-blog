import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

const Container = styled.div`
  table {
    caption {
      text-align: left;
      font-weight: bold;
    }
  }
`
const digResultMap = new Map()

export default function({ domain }) {
  const digResult = digResultMap.get(domain)
  const [digging, setDigging] = useState(false)

  useEffect(() => {
    if (!domain) return
    setDigging(true)
    // https://developers.google.com/speed/public-dns/docs/doh/json
    fetch(`https://dns.google/resolve?name=${domain}&type=A`)
      .then(d => d.json())
      .then(result => {
        digResultMap.set(domain, result)
      })
      .catch(e => digResultMap.set(domain, null))
      .finally(() => {
        setDigging(false)
      })
  }, [domain])

  if (!domain) return null
  if (digging)
    return (
      <Container>
        <h3>
          Digging <a>{domain}</a>
        </h3>
      </Container>
    )

  if (!digResult) return null

  return (
    <Container>
      <h3>
        Dig <a>{domain}</a>
      </h3>
      <table>
        <caption>ANSWER SECTION</caption>
        <thead>
          <tr>
            <td>domain</td>
            <td>TTL</td>
            <td>type</td>
            <td>address</td>
          </tr>
        </thead>

        <tbody>
          {digResult.Answer ? (
            (digResult.Answer || []).map((result, index) => (
              <tr key={index}>
                <td>{result.name}</td>
                <td>{result.TTL}</td>
                <td>{result.type}</td>
                <td>
                  <a>{result.data}</a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                NO ANSWER
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Container>
  )
}
