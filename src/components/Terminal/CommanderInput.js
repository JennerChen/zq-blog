import React, { useRef, useEffect, useState, useContext } from 'react'

import styled from 'styled-components'

import autosize from 'autosize'

import Context from './Store'

const Container = styled.div`
  display: flex;
  font-size: 11pt;
`

function AutoSizeTextArea({ ...props }) {
  const textArea = useRef(null)

  useEffect(() => {
    autosize(textArea.current)
  }, [])
  return <textarea ref={textArea} spellCheck={false} {...props} />
}

const Input = styled(AutoSizeTextArea)`
  border: none;
  outline-color: #30353a;
  background-color: transparent;
  color: #fff;
  font-size: 11pt;
  padding-left: 8pt;
  flex: 1;
  resize: none;
  height: 27px;
`

const PromptLabel = styled.span`
  position: relative;
  top: 2px;
`

export default function({ label, initValue, readOnly }) {
  const [value, setValue] = useState(initValue)

  const context = useContext(Context)

  const [helpIndex, setHelpIndex] = useState(null)

  const displayLabel = (label ? label : context.currPath).split('/').pop()

  return (
    <Container>
      <PromptLabel className={`prompt`}>
        <span className="root">{displayLabel}</span>
        <span className="tick">❯</span>
      </PromptLabel>
      <Input
        readOnly={readOnly}
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        onKeyDown={event => {
          switch (event.keyCode) {
            case 13:
              if (value) {
                // 用户输入 回车, 执行命令
                context.execCommand(value)
                // 重置值
                setValue('')
                // 滚动到最底部
                context.scrollToBottomAsync()
                // 清零上一步
                setHelpIndex(null)
              }
              // 调用 preventDefault, 禁止后面事件继续触发
              event.preventDefault()
              break
            case 38:
              // 向上翻动
              if (context.history.length > 0) {
                let useHistoryIndex = Math.max(
                  0,
                  helpIndex ? helpIndex - 1 : context.history.length - 1
                )
                setValue(context.history[useHistoryIndex].command)
                setHelpIndex(useHistoryIndex)
              }
              event.preventDefault()
              break
            case 40:
              // 向下翻动
              if (helpIndex >= 0) {
                let useHistoryIndex = Math.min(
                  context.history.length - 1,
                  helpIndex + 1
                )
                setValue(context.history[useHistoryIndex].command)
                setHelpIndex(useHistoryIndex)
              }
              event.preventDefault()
              break
            default:
          }
        }}
      />
    </Container>
  )
}
