import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import Helmet from "react-helmet"
import styled, { createGlobalStyle } from 'styled-components'
import LeftSidebar from './LeftSidebar'
import { GlobalTheme } from '../utils/theme'

const Flex = styled.div`
  display: flex;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  flex-shrink: 0;
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
    const { location, title, children, tags, sideBar, meta } = this.props
    //    const rootPath = `${__PATH_PREFIX__}/`
    //    let header
    return (
      <Fragment>
        <GlobalStyle />
        <GlobalTheme />
        <Helmet
          htmlAttributes={{ lang: 'cn' }}
          title={title}
          meta={ meta }
        >
          <link
            rel={'stylesheet'}
            type={'text/css'}
            href={'//at.alicdn.com/t/font_585271_6fnuvd8aj0d7k3xr.css'}
          />
        </Helmet>
        <Flex style={{ minHeight: '100%' }}>
          { sideBar ? <LeftSidebar tags={ tags }/> : null }
          <Content>{children}</Content>
        </Flex>
      </Fragment>
    )
  }
}

Layout.defaultProps = {
  sideBar: true
}

export default Layout
