import React, { useEffect, useState, useContext } from 'react'
import { ErrorMessage, Spin } from '../style'
import Context from '../Store'
export default ({ content }) => {
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const [displayContent, setContent] = useState(undefined)

  const context = useContext(Context)

  useEffect(() => {
    if (typeof content === 'string') {
      setContent(content)
      setLoading(false)
    } else {
      content()
        .then(data => {
          setContent(data)
          context.scrollToBottomAsync()
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
