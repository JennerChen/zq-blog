import React from 'react'

export default function({ list = [] }) {
  return (
    <ul>
      {list.map(({ command, id }) => (
        <li key={id}>{command}</li>
      ))}
    </ul>
  )
}
