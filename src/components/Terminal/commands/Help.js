import React from 'react'

export default function() {
  return (
    <div>
      <ul>
        <li>
          <strong>path</strong> - display current directory
        </li>
        <li>
          <strong>cat FILENAME</strong> - display FILENAME in window
        </li>
        <li>
          <strong>cd DIRECTORY</strong> - move into DIRECTORY or just cd to
          return to root
        </li>
        <li>
          <strong>ls</strong> - show files in current directory
        </li>
        <li>
          <strong>history</strong> - see your command history
        </li>
        <li>
          <strong>clear</strong> - clear current window
        </li>
      </ul>
    </div>
  )
}
