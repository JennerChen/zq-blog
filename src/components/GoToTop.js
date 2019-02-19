import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import media from 'styled-media-query'

const fadeIn = keyframes`
    from{
        transform: translateY(0);
    }
    
    to{
        transform: translateY(-7rem);
        
    }
`

const fadeOut = keyframes`
    from{
        transform: translateY(-7rem);
    }
    
    to{
        transform: translateY(0);
    }
`

const Container = styled.div`
  position: fixed;
  pointer-events: none;
  backface-visibility: hidden;

  & a {
    display: inline-block;
    animation-fill-mode: forwards !important;
    animation: ${props => (props.hide ? fadeOut : fadeIn)} 0.6s;
    position: fixed;
    width: 3rem;
    height: 3rem;
    bottom: -3rem;
    backface-visibility: hidden;
    text-decoration: none;
    user-select: none;
    pointer-events: all;
    outline: none;
    overflow: hidden;
    right: 6rem;
    ${media.between('small', 'medium')`
      right: 3rem;
    `}

    ${media.lessThan('small')`
        right: 1rem;
    `}
  }

  & svg {
    display: block;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    path {
      transition: all 0.1s;
    }
  }

  & #scrolltop-arrow {
    transform: scale(0.66);
    transform-origin: center;
    fill: white;
  }

  & #scrolltop-bg {
    fill: #007bff;
  }

  & a:hover {
    #scrolltop-bg {
      fill: #2990ff;
    }
  }

  @media print {
    display: none !important;
  }
`

export default class extends Component {
  state = {
    hide: true,
  }

  firstRun = true

  componentDidMount() {
    window.addEventListener('scroll', this.handleWindowScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleWindowScroll)
  }

  handleWindowScroll = () => {
    let btnShouldHide = window.scrollY <= 100


    if (!btnShouldHide) {
      this.firstRun = false
    }
    if (this.state.hide !== btnShouldHide) {
      this.setState({
        hide: btnShouldHide,
      })
    }
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0, // could be negative value
      left: 0,
      behavior: 'smooth',
    })
  }

  render() {
    if (this.firstRun) return null

    return (
      <Container hide={this.state.hide}>
        <a
          onClick={this.scrollToTop}
          href="javascript:void(0)"
          role="button"
          aria-label="Scroll to top"
        >
          <svg
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path id="scrolltop-bg" d="M0 0h48v48h-48z" />
            <path
              id="scrolltop-arrow"
              d="M14.83 30.83l9.17-9.17 9.17 9.17 2.83-2.83-12-12-12 12z"
            />
          </svg>
        </a>
      </Container>
    )
  }
}
