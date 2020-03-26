import React, { Component } from 'react'

import styled from 'styled-components'
import { rhythm } from '../utils/typography'
const Button = styled.button`
  padding: ${rhythm(2 / 16)} ${rhythm(12 / 16)};
  border-radius: 20px;
  text-transform: uppercase;
  font-size: 1em;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
  outline: none;
  background-color: transparent;
  border: 1px solid lightgrey;
  color: #969696;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 20px;
    z-index: -2;
  }

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: #008fb3;
    transition: all 0.3s;
    border-radius: 20px;
    z-index: -1;
  }
  &:hover,
  &:focus {
    border-color: transparent;
    color: #fff;
    &:before {
      width: 100%;
    }
  }
`

export default class extends Component {
  render() {
    const { children, ...rest } = this.props
    return <Button {...rest}> {children}</Button>
  }
}
