import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { switchProp } from 'styled-tools'
import styled, {
  createGlobalStyle,
  ThemeProvider,
  css,
} from 'styled-components'
import LeftSidebar from './LeftSidebar'
import { GlobalTheme } from '../utils/theme'
import GoToTop from "../components/GoToTop"

const Flex = styled.div`
  display: flex;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  flex-shrink: 0;
  transition: background-color 0.3s;

  ${switchProp('theme.mode', {
    dark: css`
      background-color: #27221a;
      color: #f6e6cc;

      & a {
        color: #ba832c;
      }

      blockquote {
        color: #f6e6cc;
        border-left: 4px solid #ff9b51;
      }

      hr {
        background-color: rgba(255, 255, 255, 0.2);
      }

      h2 {
        border-color: rgba(255, 255, 255, 0.2);
      }

      code[class*="language-"] {
        color: #f95d5d;
      }
    `,
  })}
`

const GlobalStyle = createGlobalStyle`
    html{
        height: 100%;
    };
    
    body, #___gatsby{
        min-height: 100%;
        height: 100%;
        //background-color: #efefef;
    }
    
    #___gatsby {
        display: flex; 
    }
    
    #___gatsby > div {
        width: 100%;
        flex-shrink: 0;
    }
`

class Layout extends React.Component {
  render() {
    const { title, children, tags, sideBar, meta, theme } = this.props

    return (
      <ThemeProvider theme={{ mode: theme }}>
        <Fragment>
          <GlobalStyle />
          <GlobalTheme />
          <Helmet htmlAttributes={{ lang: 'cn' }} title={title} meta={meta}>
            <link
              rel={'stylesheet'}
              type={'text/css'}
              href={'//at.alicdn.com/t/font_585271_t86bw1k535.css'}
            />
          </Helmet>
          <Flex style={{ minHeight: '100%' }}>
            {sideBar ? <LeftSidebar tags={tags} /> : null}
            <Content>{children}</Content>
          </Flex>
          <GoToTop/>
        </Fragment>
      </ThemeProvider>
    )
  }
}

Layout.defaultProps = {
  sideBar: true,
  theme: 'light',
}

export default Layout
