import React, { Component } from 'react'

import styled from 'styled-components'
import { rhythm } from '../utils/typography'
const Button = styled.button`
  border-radius: 20px;
  //height: 1.5em;
  border: 1px solid lightgrey;
  transition: all 0.3s;
  
  padding: ${rhythm(2 / 16)} ${rhythm(12 / 16)};
  cursor: pointer;
  outline: none;
  font-size: 1em;
  color: #969696;
  background-color: transparent;
  
  &:hover {
    border-color: #969696;
    
    color: #333;
  }
`
export default class extends Component {
  render() {
    const { children, ...rest } = this.props
    return <Button {...rest}> {children}</Button>
  }
}
