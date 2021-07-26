import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
export default function() {
  const [time, setTime] = useState(2)

  useEffect(() => {
    setTimeout(() => {
      if (time === 0) {
        navigate('/', { replace: true })
      } else {
        setTime(time - 1)
      }
    }, 1000)
  }, [time])

  return <span>Exiting... return after {time}s</span>
}
