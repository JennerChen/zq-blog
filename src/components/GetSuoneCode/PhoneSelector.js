import React, { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const Field = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const FieldLabel = styled.label`
  flex: none;
  color: #333;
`

const Trigger = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  color: ${props => (props.$placeholder ? '#999' : '#333')};
  background: #fff;
  border: 1px solid ${props => (props.$open ? '#409eff' : '#ccc')};
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
`

const Arrow = styled.span`
  flex: none;
  margin-left: 8px;
  border: solid #999;
  border-width: 0 2px 2px 0;
  padding: 3px;
  transform: ${props => (props.$open ? 'rotate(-135deg)' : 'rotate(45deg)')};
  transition: transform 0.2s ease;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;

  @media (max-width: 768px) {
    background: rgba(0, 0, 0, 0.45);
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

const Panel = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 9999;
  max-height: 260px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 60vh;
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    border: none;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.12);
    animation: ${slideUp} 0.25s ease;
  }
`

const SheetTitle = styled.li`
  display: none;

  @media (max-width: 768px) {
    display: block;
    padding: 8px 20px 12px;
    color: #999;
    font-size: 14px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }
`

const Option = styled.li`
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: ${props => (props.$active ? '#409eff' : '#333')};
  background: ${props => (props.$active ? '#f0f7ff' : 'transparent')};
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    text-align: center;
  }
`

const normalize = item => (typeof item === 'string' ? item : item.phone)

export default ({ phoneList, onSelect, selectedPhone, onMore }) => {
  // const [selectedPhone, setSelectedPhone] = useState('')
  const [open, setOpen] = useState(false)
  const fieldRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = e => {
      if (fieldRef.current && !fieldRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  const handleSelect = phone => {
    // setSelectedPhone(phone)
    setOpen(false)
    if (phone && typeof onSelect === 'function') {
      onSelect(phone)
    }
  }

  const handleMore = () => {
    setOpen(false)

    onMore()
  }

  return (
    <Field ref={fieldRef}>
      <FieldLabel htmlFor="suone-phone">手机号:</FieldLabel>
      <Trigger
        id="suone-phone"
        type="button"
        $open={open}
        $placeholder={!selectedPhone}
        onClick={() => setOpen(prev => !prev)}
      >
        {selectedPhone || '请选择手机号'}
        <Arrow $open={open} />
      </Trigger>
      {open && (
        <>
          <Overlay onClick={() => setOpen(false)} />
          <Panel>
            <SheetTitle>请选择手机号</SheetTitle>
            {(phoneList || []).map(item => {
              const phone = normalize(item)
              return (
                <Option
                  key={phone}
                  $active={phone === selectedPhone}
                  onClick={() => handleSelect(phone)}
                >
                  {phone}
                </Option>
              )
            })}

            <Option key={'more'} onClick={handleMore}>
              更多
            </Option>
          </Panel>
        </>
      )}
    </Field>
  )
}
