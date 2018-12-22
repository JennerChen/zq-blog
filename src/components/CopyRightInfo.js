import React from 'react'
import styled from 'styled-components'

const CopyRightContainer = styled.div`
  font-size: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
  font-weight: bold;
`

const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
const regex = new RegExp(expression)

export default function({ original }) {
  if (original) {
    return (
      <CopyRightContainer>
        转载自{' '}
        {regex.test(original) ? (
          <a href={original} target={'_blank'}>
            {original}
          </a>
        ) : (
          original
        )}
      </CopyRightContainer>
    )
  }

  return <CopyRightContainer>未经许可, 不可转载</CopyRightContainer>
}
