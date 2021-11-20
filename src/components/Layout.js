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
import GoToTop from '../components/GoToTop'
import Footer from './Footer'
import DayNightSwitch from './DayNightSwitch'

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
  overflow: auto;
  overscroll-behavior: contain;
  ${switchProp('theme.mode', {
    dark: css`
      --BLOG-BACKGROUND-COLOR: #27221a;
      --BLOG-COLOR: #f6e6cc;

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

      code[class*='language-'] {
        color: #f95d5d;
      }

      table tr td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
    `,
    light: css`
      --BLOG-BACKGROUND-COLOR: #fff;
      --BLOG-COLOR: #333;
    `,
  })};

  background-color: var(--BLOG-BACKGROUND-COLOR);
  color: var(--BLOG-COLOR);
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
    
    a[href] {
        cursor: pointer;
        text-decoration: currentColor;
    }
`

class Layout extends React.Component {
  state = {
    mode: 'light',
  }

  componentDidMount() {
    // ssr 不会执行
    if (localStorage.getItem('theme')) {
      this.setState({
        mode: localStorage.getItem('theme'),
      })

      return
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)')
    ) {
      let mode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      this.setState({
        mode,
      })
    }
  }

  toggleDarkMode = bool => {
    localStorage.setItem('theme', bool ? 'light' : 'dark')
    this.setState({ mode: bool ? 'light' : 'dark' })
  }

  render() {
    const {
      title,
      children,
      tags,
      sideBar,
      meta,
      extraHeader,
      headerClassName,
    } = this.props

    const { mode } = this.state

    return (
      <ThemeProvider theme={{ mode }}>
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
          <Flex style={{ minHeight: '100%', height: '100%' }}>
            {sideBar ? <LeftSidebar tags={tags} /> : null}
            <Content>
              <div className={headerClassName}>
                <DayNightSwitch
                  checked={this.state.mode === 'light'}
                  onChange={val => this.toggleDarkMode(val)}
                />

                {extraHeader ? extraHeader : null}
              </div>
              {children}
              <Footer />
            </Content>
          </Flex>
          <GoToTop />
        </Fragment>
      </ThemeProvider>
    )
  }
}

Layout.defaultProps = {
  sideBar: true,
}

export default Layout
