import React, { Fragment } from 'react'
import { Link } from 'gatsby'
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
    const { location, title, children } = this.props
    //    const rootPath = `${__PATH_PREFIX__}/`
    //    let header

    return (
      <Fragment>
        <GlobalStyle />
        <GlobalTheme />
        <Flex style={{ minHeight: '100%' }}>
          <LeftSidebar />
          <Content>{children}</Content>
        </Flex>
      </Fragment>
    )
  }
}

export default Layout
