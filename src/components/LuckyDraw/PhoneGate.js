import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { isValidPhone } from '../../services/luckyDraw'

const COUNTDOWN_SECONDS = 60

const Field = styled.div`
  margin: 12px 0;
`

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-size: 14px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Input = styled.input`
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    border-color: #409eff;
  }
`

const CodeButton = styled.button`
  flex: none;
  min-width: 108px;
  min-height: 44px;
  padding: 0 12px;
  color: #409eff;
  font-size: 14px;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    color: #a0cfff;
    border-color: #a0cfff;
    cursor: not-allowed;
  }
`

const SubmitButton = styled.button`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  margin-top: 16px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  background: #409eff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease;

  &:hover {
    background: #66b1ff;
  }

  &:active {
    background: #3a8ee6;
  }

  &:disabled {
    background: #a0cfff;
    cursor: not-allowed;
  }
`

const Tip = styled.p`
  margin: 8px 0 0;
  color: #909399;
  font-size: 13px;
  line-height: 1.6;
`

const FieldError = styled.p`
  margin: 8px 0 0;
  color: #d8000c;
  font-size: 13px;
  line-height: 1.6;
`

const onlyDigits = value => (value || '').replace(/\D/g, '').slice(0, 11)

export default ({ mode, submitting, sending, error, onSendCode, onSubmit }) => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [fieldError, setFieldError] = useState('')
  const timerRef = useRef(null)

  const isSmsMode = mode === 'sms'

  useEffect(() => () => clearInterval(timerRef.current), [])

  const startCountdown = () => {
    setCountdown(COUNTDOWN_SECONDS)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      setFieldError('请输入正确的 11 位手机号')
      return
    }

    setFieldError('')
    const sent = await onSendCode(phone)
    if (sent) startCountdown()
  }

  const handleSubmit = () => {
    if (!isValidPhone(phone)) {
      setFieldError('请输入正确的 11 位手机号')
      return
    }

    if (isSmsMode && !code) {
      setFieldError('请输入短信验证码')
      return
    }

    setFieldError('')
    onSubmit({ phone, code })
  }

  const busy = submitting || sending

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="lucky-draw-phone">手机号</FieldLabel>
        <Row>
          <Input
            id="lucky-draw-phone"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            placeholder="请输入 11 位手机号"
            value={phone}
            disabled={busy}
            onChange={e => setPhone(onlyDigits(e.target.value))}
          />
          {isSmsMode && (
            <CodeButton
              type="button"
              disabled={busy || countdown > 0}
              onClick={handleSendCode}
            >
              {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
            </CodeButton>
          )}
        </Row>
      </Field>

      {isSmsMode && (
        <Field>
          <FieldLabel htmlFor="lucky-draw-code">短信验证码</FieldLabel>
          <Row>
            <Input
              id="lucky-draw-code"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="请输入收到的验证码"
              value={code}
              disabled={busy}
              onChange={e => setCode((e.target.value || '').replace(/\D/g, ''))}
            />
          </Row>
        </Field>
      )}

      {fieldError && <FieldError>{fieldError}</FieldError>}
      {!fieldError && error && <FieldError>{error}</FieldError>}

      <SubmitButton type="button" disabled={busy} onClick={handleSubmit}>
        {busy ? '处理中...' : isSmsMode ? '验证并继续' : '继续'}
      </SubmitButton>

      <Tip>
        {isSmsMode
          ? '微信内需通过短信验证码确认手机号后才能参与抽奖'
          : '仅活动名单内的手机号可以参与抽奖'}
      </Tip>
    </div>
  )
}
