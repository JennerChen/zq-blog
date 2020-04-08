import React, { useContext } from 'react'
import Context from './Store'
import CommanderInput from './CommanderInput'
export default function() {
  const context = useContext(Context)

  return context.shownHistory.map(({ command, message, id, path }) => (
    <div key={id}>
      <CommanderInput label={path} initValue={command} readOnly />
      <div>{message}</div>
    </div>
  ))
}
