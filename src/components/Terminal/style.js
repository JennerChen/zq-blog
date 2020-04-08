import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import React from 'react'
import ContentLoader from 'react-content-loader'
const ErrorContainer = styled.div``

export const ErrorMessage = ({ children }) => {
  return (
    <ErrorContainer>
      <span style={{ color: 'red' }}>Error</span>:&nbsp;&nbsp;{children}
    </ErrorContainer>
  )
}

export const FileLabel = styled.span`
  margin-right: 12px;
  ${props =>
    props.isDir
      ? css`
          color: #88def2;
        `
      : ''}
`

export const fontFamily = '"Lato", Georgia, Serif'

export const GlobalTheme = createGlobalStyle`
body {
  background-color: #211E3A;
}

.terminal-window {
  text-align: left;
  width: 600px;
  height: 360px;
  border-radius: 10px;
  margin: auto;
  position: relative;
  display: block;
  top: 25vh;

  &.fullscreen {
    z-index: 9999;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;

    header {
      display: none;
    }

    #terminal {
      top: 0;
    }
   }

  header {
    background: #e0e8f0;
    height: 30px;
    border-radius: 8px 8px 0 0;
    padding-left: 10px;

    .button {
      width: 12px;
      height: 12px;
      margin: 10px 4px 0 0;
      display: inline-block;
      border-radius: 8px;
    }

    .button.green {
      background: #3bb662;
      cursor: pointer;
    }

    .button.yellow {
      background: #e5c30f;
    }

    .button.red {
      background: #e75448;
      cursor: pointer;
    }
  }

  #terminal {
    color: white;
    font-family: Menlo, Monaco, "Consolas", "Courier New", "Courier";
    font-size: 11pt;
    background: #30353a;
    padding: 10px;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    top: 30px;
    bottom: 0;
    overflow: auto;
  }

  .contact {
    list-style: none;
    margin-left: -30px;
  }

  h4 {
    text-align: center;
  }

  a {
    text-align: center;
    display: block;
  }

  .input {
    outline-color:  #30353a;
    border:         none;
    display:        inline-block;
  }

  .root {
    color: #95F584;
  }

  .tick {
    color: #EC4891;
  }

  .blue {
    color: lightblue;
  }

  .gray {
    color: gray;
  }

  .dir {
    color: #88DEF2;
  }

  .green {
    color: green;
  }
}

.command_input {
  border: none;
  background: #000634;
  color: white;
}

.footer {
  position: fixed;
  bottom: 0;
  text-align: center;
  line-height: 0.1px;
  width: 100%;
  color: white;
  font-family: ${fontFamily};

  .site-code {
    font-weight: bold;
    color: lightblue;
  }
}

.terminal-data {
  display: none;
}
`

const PushAnimation = keyframes`
  50% {
    left: 56px;
  }
`

const SpinContainer = styled.div`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 30px;
`

export const SpinInner = styled.div`
  position: absolute;
  box-sizing: border-box;
  border-radius: 16px;
  top: 5px;
  width: 80px;
  height: 20px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.4);

  &::before {
    content: '';
    position: absolute;
    border-radius: 16px;
    width: 20px;
    height: 12px;
    left: 0;
    background: #fff;
    animation: ${PushAnimation} 1s infinite linear;
  }
`

export const Spin = props => (
  <ContentLoader
    viewBox="0 0 462 60"
    height={60}
    width={462}
    speed={2}
    backgroundColor={'transparent'}
    {...props}
  >
    <rect x="90" y="16" rx="5" ry="5" width="321" height="15" />
    <rect x="129" y="39" rx="5" ry="5" width="220" height="9" />
    <rect x="26" y="10" rx="0" ry="0" width="50" height="45" />
    <rect x="13" y="54" rx="0" ry="0" width="0" height="0" />
    <rect x="13" y="50" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)
