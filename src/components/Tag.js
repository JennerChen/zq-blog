import styled, { css } from 'styled-components'
import React, { Component } from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'

const TagContainer = styled.div`
  display: inline-flex;
  margin: 0 5px 10px;
  overflow: hidden;

  &.alwaysShow,
  &:hover {
    & > .count {
      max-width: 50px;
    }
  }
`

const TagContainerLabel = styled(Link)`
  float: left;
  background: linear-gradient(#fff, #f0f0f0);
  border: 1px solid #d4d4d4;
  border-bottom-color: #a1a1a1;

  ${props =>
    props.count
      ? css`
          border-right-color: #a43e00;
          border-radius: 3px 0 0 3px;
        `
      : css`
          border-radius: 3px;
        `};
  padding: 0 9px 0 7px;
  font: bold 12px/22px 'Helvetica Neue', 'Arial', sans-serif;
  color: #4078c0;
  position: relative;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-left: 1px solid #a43e00;
    border-radius: 50%;
    background: #f25d00;
    position: absolute;
    right: -4px;
    top: 8px;
    z-index: 1;
  }

  &:hover {
    opacity: 0.8;
  }
`

const TagCountContainer = styled.span.attrs({
  className: 'count',
})`
  float: left;
  margin-top: 1px;
  height: 20px;
  border-top: 1px solid #dc5400;
  border-bottom: 1px solid #dc5400;
  background: linear-gradient(#f46e00, #ec5400);
  overflow: hidden;
  box-shadow: inset 0 1px 0 #fd9d61;
  position: relative;
  max-width: 3px;
  transition: max-width 0.3s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 100%;
    border-right: 1px solid #dc5400;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -3px;
    width: 4px;
    height: 4px;
    border-radius: 50%;

    /* Needs to be the background color */
    background: #333;
    box-shadow: 0 6px 0 #333, 0 11px 0 #333, 0 16px 0 #333;
  }
`

const TagCount = styled.span`
  margin: 1px 4px 0 0;
  padding: 0 3px 0 5px;
  border-top: 1px dashed #d74a02;
  border-bottom: 1px dashed #f57a36;
  font: bold 12px/18px 'Helvetica Neue', 'Arial', sans-serif;
  color: #fff;
  height: 17px;
  position: relative;
  float: right;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 100%;
    border-top: 1px dashed #f87e31;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0;
    width: 100%;
    border-bottom: 1px dashed #d64901;
  }
`

export default class extends Component {
  render() {
    const { label, count, alwaysShow, style } = this.props

    return (
      <TagContainer className={alwaysShow ? 'alwaysShow' : ''} style={style}>
        <TagContainerLabel
          title={`点击查看所有关于${label}的笔记`}
          count={count}
          to={`/tags/${kebabCase(label)}/`}
        >
          {label}
        </TagContainerLabel>
        {count ? (
          <TagCountContainer>
            <TagCount>{count}</TagCount>
          </TagCountContainer>
        ) : null}
      </TagContainer>
    )
  }
}
