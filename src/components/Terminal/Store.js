import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react'
import { Help, History, Path, Cat, Ls } from './commands'
import { ErrorMessage } from './style'
import { pathNav, getRandomId } from './utils'

const Store = createContext({})

export const Consumer = Store.Consumer

export const Provider = ({ children, files, basePath, onClose }) => {
  const [fullScreen, setFullScreen] = useState(false)

  const [historyList, setHistory] = useState([])

  const [currPath, setPath] = useState(basePath)

  const container = useRef(null)

  const scrollToBottom = useCallback(() => {
    container.current.scrollTo({
      top: container.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [container])

  const scrollToBottomAsync = useCallback(() => {
    setTimeout(() => scrollToBottom(), 32)
  }, [scrollToBottom])

  const execCommand = useCallback(
    commandStr => {
      const [commandName, ...args] = commandStr.split(' ')

      function addCommand(command) {
        const id = getRandomId()

        setHistory(historyList => {
          return [
            ...historyList,
            {
              hideInWindow: false,
              id,
              path: currPath,
              ...command,
            },
          ]
        })
      }

      function addHistoryCommand() {
        const id = getRandomId()

        setHistory(historyList => {
          let list = historyList.map(({ command, id }) => ({ command, id }))
          return [
            ...historyList,
            {
              hideInWindow: false,
              id,
              path: currPath,
              message: <History list={list} />,
              command: commandStr,
            },
          ]
        })
      }

      function cdPath() {
        let targetPath = pathNav(currPath, basePath).go(args[0])

        let message = null
        if (targetPath === basePath) {
          setPath(basePath)
        } else {
          // 查找目录是否存在
          let targetFold = files.find(({ path }) => targetPath === path)

          if (targetFold) {
            if (targetFold.content) {
              message = (
                <ErrorMessage>{args[0]} is not a valid directory </ErrorMessage>
              )
            } else {
              setPath(targetPath)
            }
          } else {
            // 目录不存在
            message = <ErrorMessage>not a valid directory </ErrorMessage>
          }
        }

        addCommand({
          command: commandStr,
          message: message,
        })
      }

      switch (commandName.toLowerCase()) {
        case 'help':
          addCommand({
            command: commandStr,
            message: <Help />,
          })
          break
        case 'clear':
          setHistory(historyList =>
            historyList.map(history => ({
              ...history,
              hideInWindow: true,
              path: currPath,
            }))
          )
          addCommand({
            command: commandStr,
            message: null,
          })
          break
        case 'history':
          addHistoryCommand()
          break
        case 'path':
          addCommand({
            command: commandStr,
            message: <Path path={currPath} />,
          })
          break
        case 'cd':
          cdPath()
          break
        case 'cat':
          let fileName = args[0]
          let fullPath = currPath + `/` + fileName
          let targetFile = files.find(({ path }) => path === fullPath)
          if (targetFile) {
            addCommand({
              command: commandStr,
              message: <Cat content={targetFile.content} />,
            })
          } else {
            addCommand({
              command: commandStr,
              message: (
                <ErrorMessage
                  children={`file not found in current directory`}
                />
              ),
            })
          }
          break
        case 'ls':
          let currFoldFiles = files.filter(
            file => file.path === currPath + '/' + file.name
          )
          addCommand({
            command: commandStr,
            message: <Ls files={currFoldFiles} />,
          })
          break
        default:
          addCommand({
            command: commandStr,
            message: <ErrorMessage children={`command not recognized`} />,
          })
      }
    },
    [currPath, files]
  )

  const shownHistory = useMemo(() => {
    return historyList.filter(({ hideInWindow }) => !hideInWindow)
  }, [historyList])

  useEffect(() => {
    container.current.focus()
  }, [])

  const handleKeyDown = function({ keyCode }) {
    switch (keyCode) {
      case 27:
        setFullScreen(!fullScreen)
        break
      default:
    }
  }

  return (
    <Store.Provider
      value={{
        history: historyList,
        shownHistory: shownHistory,
        execCommand,
        currPath,
        files,
        scrollToBottom,
        scrollToBottomAsync,
      }}
    >
      <div
        className={['terminal-window', fullScreen ? `fullscreen` : ''].join(
          ' '
        )}
      >
        <header>
          <div className="button red" onClick={onClose} />
          <div className="button yellow" />
          <div
            className="button green"
            onClick={() => setFullScreen(!fullScreen)}
          />
        </header>
        <div
          tabIndex={'0'}
          id="terminal"
          ref={container}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </div>
    </Store.Provider>
  )
}

export default Store
