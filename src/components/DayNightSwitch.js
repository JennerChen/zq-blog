import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 7.5rem;
  height: 4rem;
  transform: scale(0.5);
  & label {
    cursor: pointer;
  }
`

const Input = styled.input.attrs({
  className: 'toggle-switch',
  type: 'checkbox',
  id: 'toggle',
})`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
`

const Stars = styled.div`
  position: absolute;
  height: 0.4rem;
  width: 0.4rem;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.3s all ease;

  &:before,
  &:after {
    position: absolute;
    content: '';
    display: block;
    height: 0.25rem;
    width: 0.25rem;
    background: #ffffff;
    border-radius: 50%;
    transition: 0.2s all ease;
  }
`

const Star1 = styled(Stars)`
  top: 6px;
  right: 23px;

  &:after {
    top: 8px;
    right: 20px;
  }

  &:before {
    top: 18px;
    right: -12px;
  }
`

const Star2 = styled(Stars)`
  top: 40px;
  right: 48px;

  &:after {
    top: -8px;
    right: -16px;
  }

  &:before {
    top: 6px;
    right: -26px;
  }
`

const SunMoon = styled.div.attrs({
  className: 'sun-moon',
})`
  z-index: 2;
  position: absolute;
  left: 0;
  display: inline-block;
  height: 3rem;
  width: 3rem;
  margin: 0.5rem;
  background: #fffdf2;
  border-radius: 50%;
  transition: all 0.5s ease;

  /* Default to Moon */
  border: 0.25rem solid #dee2c6;

  & .dots {
    position: absolute;
    top: 3px;
    left: 23px;
    height: 1rem;
    width: 1rem;
    background: #efeedb;
    border: 0.25rem solid #dee2c6;
    border-radius: 50%;
    transition: 0.4s all ease;
  }

  & .dots:after,
  & .dots:before {
    position: absolute;
    content: '';
    display: block;
    height: 0.25rem;
    width: 0.25rem;
    background: #efeedb;
    border: 0.25rem solid #dee2c6;
    border-radius: 50%;
    transition: 0.4s all ease;
  }

  & .dots:after {
    top: -4px;
    left: -26px;
  }

  & .dots:before {
    top: 18px;
    left: -10px;
  }

  &.light-mode {
    left: calc(100% - 4rem);
    background: #f5ec59;
    border-color: #e7c65c;
    transform: rotate(-25deg);

    & .dots {
      height: 1.5rem;
      width: 1.5rem;
      top: 0px;
      left: -20px;
      transform: rotate(25deg);
    }

    & .dots,
    & .dots:after,
    & .dots:before {
      background: #ffffff;
      border-color: #ffffff;
    }

    & .dots:after {
      height: 0.65rem;
      width: 0.65rem;
      top: 2px;
      left: -12px;
    }

    & .dots:before {
      height: 0.4rem;
      width: 0.4rem;
      top: 6px;
      left: 14px;
    }
  }
`

const ContainerBg = styled.div`
  z-index: 1;
  position: absolute;
  width: 7.5rem;
  height: 4rem;
  border-radius: 2.5rem;
  border: 0.25rem solid #202020;
  background: linear-gradient(to right, #484848 0%, #202020 100%);
  transition: all 0.3s;

  &.light-mode {
    border: 0.25rem solid #78c1d5;
    background: linear-gradient(to right, #78c1d5 0%, #bbe7f5 100%);

    & ${Stars} {
      opacity: 0;
      transform: translateY(2rem);
    }
  }
`

export default class DayNightSwitch extends React.Component {
  constructor(props) {
    super(props)
    this.inputId = 'toggle___' + Math.random()
  }

  render() {
    const { checked, onChange } = this.props
    const className = checked ? `light-mode` : `dark-mode`
    return (
      <Container>
        <label htmlFor={this.inputId}>
          <Input
            id={this.inputId}
            checked={checked}
            onChange={({ target: { checked } }) => {
              onChange(checked)
            }}
          />
          <SunMoon className={className}>
            <div className="dots" />
          </SunMoon>
          <ContainerBg className={`background ${className}`}>
            <Star1/>
            <Star2/>
          </ContainerBg>
        </label>
      </Container>
    )
  }
}
