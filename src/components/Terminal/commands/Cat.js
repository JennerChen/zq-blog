import React, { useEffect, useState } from 'react'
import { ErrorMessage, Spin } from '../style'
export default ({ content }) => {
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [displayContent, setContent] = useState(undefined)

  useEffect(() => {
    if (typeof content === 'string') {
      setContent(content)
      setLoading(false)
    } else {
      content()
        .then(data => {
          setContent(data)
        })
        .catch(() => {
          setError(`can't load file content`)
        })
        .finally(() => setLoading(false))
    }
  }, [])

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  if (loading) return <Spin />
  return <p dangerouslySetInnerHTML={{ __html: displayContent }} />
}
