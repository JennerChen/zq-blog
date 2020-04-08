// base on https://github.com/codebytere/codebytere.github.io

import React from 'react'
import { Provider } from './Store'
import CommanderInput from './CommanderInput'
import HistoryList from './HistoryList'
import { GlobalTheme } from './style'
export default function({ basePath, files, onClose }) {
  return (
    <Provider basePath={basePath} files={files} onClose={onClose}>
      <>
        <GlobalTheme />
        <p>
          <span className="green">\[._.]/</span> - 你正在使用我的terminal! 敲
          `help` 以开始.
        </p>
        <HistoryList />
        <CommanderInput />
      </>
    </Provider>
  )
}
