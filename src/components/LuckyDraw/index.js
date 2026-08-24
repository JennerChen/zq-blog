import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import PhoneGate from './PhoneGate'
import Wheel, { PRIZE_SECTOR_INDEX, randomLoseSectorIndex } from './Wheel'
import {
  DEADLINE_TIP,
  LOSE_TIP,
  PRIZE_NAME,
  PRIZE_TIP,
  drawResult,
  findRecord,
  getLoggedInPhone,
  isExpired,
  isInWhitelist,
  isValidPhone,
  loginWithSmsCode,
  maskPhone,
  saveRecord,
  sendSmsCode,
  signOutSmsLogin,
} from '../../services/luckyDraw'

const Card = styled.div`
  box-sizing: border-box;
  max-width: 480px;
  margin: 24px auto;
  padding: 24px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    padding: 16px;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`

const Title = styled.h2`
  margin: 0 0 16px;
  color: #222;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`

const Loading = styled.p`
  margin: 24px 0;
  color: #909399;
  font-size: 15px;
  text-align: center;
`

const Notice = styled.div`
  box-sizing: border-box;
  margin: 16px 0;
  padding: 16px;
  color: #614700;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  word-break: break-word;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
`

const ErrorMessage = styled.div`
  box-sizing: border-box;
  margin: 16px 0;
  padding: 16px;
  color: #d8000c;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  word-break: break-word;
  background: #ffecec;
  border: 1px solid #ffbaba;
  border-radius: 8px;
`

const ResultBox = styled.div`
  box-sizing: border-box;
  margin-top: 16px;
  padding: 16px;
  color: #333;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  word-break: break-word;
  background: #f0f7ff;
  border: 1px solid #d6e8ff;
  border-radius: 8px;
`

const ResultTitle = styled.p`
  margin: 0 0 8px;
  color: #ad4e00;
  font-size: 18px;
  font-weight: 600;
`

const ActionButton = styled.button`
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
  margin: 16px 0 0;
  color: #909399;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
`

// 微信内退出短信登录态的入口, 弱化样式避免干扰主流程
const SignOutButton = styled.button`
  display: block;
  margin: 16px auto 0;
  padding: 4px 8px;
  color: #909399;
  font-size: 13px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: underline;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    color: #c0c4cc;
    cursor: not-allowed;
  }
`

const SignOutError = styled.p`
  margin: 8px 0 0;
  color: #d8000c;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
`

const WHEEL_STAGES = ['ready', 'spinning', 'saving', 'result', 'saveFailed']

export default () => {
  const [stage, setStage] = useState('detecting')
  const [isWechat, setIsWechat] = useState(false)
  const [phone, setPhone] = useState('')
  const [source, setSource] = useState('manual')
  const [record, setRecord] = useState(null)
  const [targetIndex, setTargetIndex] = useState(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const verificationRef = useRef(null)
  const resultRef = useRef(null)

  const checkEligibility = useCallback(async (targetPhone, targetSource) => {
    setPhone(targetPhone)
    setSource(targetSource)
    setError('')
    setStage('checking')

    try {
      // 先查记录: 已参与过的用户在活动结束后也能回显结果
      const existing = await findRecord(targetPhone)
      if (existing) {
        setRecord(existing)
        setStage('alreadyDrawn')
        return
      }

      if (isExpired()) {
        setStage('expiredNoRecord')
        return
      }

      const allowed = await isInWhitelist(targetPhone)
      setStage(allowed ? 'ready' : 'blocked')
    } catch (e) {
      console.error(e)
      setStage('checkFailed')
    }
  }, [])

  useEffect(() => {
    const wechat = /micromessenger/i.test(navigator.userAgent || '')
    setIsWechat(wechat)

    if (isExpired()) {
      setStage('expired')
      return
    }

    // 所有环境均走短信验证, 已有登录态时直接复用, 跳过验证码步骤
    getLoggedInPhone()
      .then(loggedInPhone => {
        if (loggedInPhone && isValidPhone(loggedInPhone)) {
          checkEligibility(loggedInPhone, 'wechat-sms')
        } else {
          setStage('gate')
        }
      })
      .catch(() => setStage('gate'))
  }, [checkEligibility])

  const handleSendCode = useCallback(async targetPhone => {
    setSending(true)
    setError('')

    try {
      const info = await sendSmsCode(targetPhone)
      // 记录发送时的手机号, 避免用户改号后误用旧验证码
      verificationRef.current = { ...info, phone: targetPhone }
      return true
    } catch (e) {
      console.error(e)
      setError('短信发送失败, 请稍后点击「获取验证码」重试')
      return false
    } finally {
      setSending(false)
    }
  }, [])

  const handleGateSubmit = useCallback(
    async ({ phone: inputPhone, code }) => {
      const verification = verificationRef.current

      if (!verification) {
        setError('请先获取短信验证码')
        return
      }

      if (verification.phone !== inputPhone) {
        setError('手机号已变更, 请重新获取验证码')
        return
      }

      setSubmitting(true)
      setError('')

      try {
        const verifiedPhone = await loginWithSmsCode({
          phone: inputPhone,
          code,
          verificationId: verification.verificationId,
          isUser: verification.isUser,
        })
        setSubmitting(false)
        checkEligibility(verifiedPhone, isWechat ? 'wechat-sms' : 'sms')
      } catch (e) {
        console.error(e)
        setError('验证码错误或已过期, 请重新获取')
        setSubmitting(false)
      }
    },
    [isWechat, checkEligibility]
  )

  const persistResult = useCallback(async () => {
    const outcome = resultRef.current

    setStage('saving')
    setError('')

    try {
      // 写入前二次查重, 兜底多标签页并发
      const existing = await findRecord(phone)
      if (existing) {
        setRecord(existing)
        setStage('alreadyDrawn')
        return
      }

      const saved = await saveRecord({
        phone,
        result: outcome,
        prize: outcome === 'win' ? PRIZE_NAME : '',
        source,
      })
      setRecord(saved)
      setStage('result')
    } catch (e) {
      console.error(e)
      setStage('saveFailed')
    }
  }, [phone, source])

  const handleDraw = () => {
    if (stage !== 'ready') return

    // 先判定结果, 再让转盘停到对应扇区, 保证动画与结果一致
    const outcome = drawResult()
    resultRef.current = outcome
    setTargetIndex(
      outcome === 'win' ? PRIZE_SECTOR_INDEX : randomLoseSectorIndex()
    )
    setStage('spinning')
  }

  const handleSignOut = useCallback(async () => {
    // 转盘动画与保存过程中不允许退出, 避免中途丢失当前手机号上下文
    if (stage === 'spinning' || stage === 'saving' || signingOut) return

    setSigningOut(true)
    setSignOutError('')

    try {
      await signOutSmsLogin()

      verificationRef.current = null
      resultRef.current = null
      setPhone('')
      setRecord(null)
      setTargetIndex(null)
      setError('')
      setStage('gate')
    } catch (e) {
      console.error(e)
      setSignOutError('退出登录失败, 请重试')
    } finally {
      setSigningOut(false)
    }
  }, [stage, signingOut])

  const maskedPhone = phone
    ? maskPhone(phone)
    : (record && record.phoneMasked) || ''

  const renderResultBox = result =>
    result === 'win' ? (
      <ResultBox>
        <ResultTitle>恭喜中奖</ResultTitle>
        <p>{PRIZE_NAME}</p>
        <p>{PRIZE_TIP}</p>
      </ResultBox>
    ) : (
      <ResultBox>{LOSE_TIP}</ResultBox>
    )

  const renderDrawButtonText = () => {
    if (stage === 'spinning') return '抽奖中...'
    if (stage === 'saving') return '正在保存结果...'
    if (stage === 'result') return '已完成'
    if (stage === 'saveFailed') return '结果未保存'
    return '立即抽奖'
  }

  const renderBody = () => {
    if (stage === 'detecting') {
      return <Loading>正在加载活动信息...</Loading>
    }

    if (stage === 'expired') {
      return (
        <>
          <Notice>活动已结束, 感谢参与</Notice>
          <ActionButton type="button" onClick={() => setStage('gate')}>
            查询我的抽奖结果
          </ActionButton>
        </>
      )
    }

    if (stage === 'gate') {
      return (
        <>
          {isExpired() && <Notice>活动已结束, 仅可查询历史抽奖结果</Notice>}
          <PhoneGate
            mode="sms"
            sending={sending}
            submitting={submitting}
            error={error}
            onSendCode={handleSendCode}
            onSubmit={handleGateSubmit}
          />
        </>
      )
    }

    if (stage === 'checking') {
      return <Loading>正在校验活动资格...</Loading>
    }

    if (stage === 'checkFailed') {
      return (
        <>
          <ErrorMessage>网络异常, 请稍后重试</ErrorMessage>
          <ActionButton
            type="button"
            onClick={() => checkEligibility(phone, source)}
          >
            重试
          </ActionButton>
        </>
      )
    }

    if (stage === 'blocked') {
      return (
        <Notice>
          {maskedPhone ? `${maskedPhone} ` : ''}
          该手机号不在本次活动名单内
        </Notice>
      )
    }

    if (stage === 'expiredNoRecord') {
      return <Notice>活动已结束, 该手机号没有参与记录</Notice>
    }

    if (stage === 'alreadyDrawn') {
      return (
        <>
          <Notice>
            您已参与过本次抽奖
            {maskedPhone ? `(${maskedPhone})` : ''}
          </Notice>
          {renderResultBox(record && record.result)}
          <ActionButton type="button" disabled>
            已参与
          </ActionButton>
        </>
      )
    }

    if (WHEEL_STAGES.indexOf(stage) > -1) {
      return (
        <>
          {maskedPhone && <Tip>抽奖手机号: {maskedPhone}</Tip>}
          <Wheel
            targetIndex={targetIndex}
            prizeName={PRIZE_NAME}
            onSpinEnd={persistResult}
          />
          <ActionButton
            type="button"
            disabled={stage !== 'ready'}
            onClick={handleDraw}
          >
            {renderDrawButtonText()}
          </ActionButton>
          {stage === 'result' && renderResultBox(resultRef.current)}
          {stage === 'saveFailed' && (
            <>
              <ErrorMessage>结果保存失败, 请重试</ErrorMessage>
              <ActionButton type="button" onClick={persistResult}>
                重试保存
              </ActionButton>
            </>
          )}
        </>
      )
    }

    return null
  }

  const showSignOut =
    phone && stage !== 'gate' && stage !== 'detecting' && stage !== 'expired'

  return (
    <Card>
      <Title>幸运抽奖</Title>
      {renderBody()}
      {showSignOut && (
        <>
          <SignOutButton
            type="button"
            disabled={signingOut || stage === 'spinning' || stage === 'saving'}
            onClick={handleSignOut}
          >
            {signingOut ? '正在退出...' : '退出短信登录(切换手机号)'}
          </SignOutButton>
          {signOutError && <SignOutError>{signOutError}</SignOutError>}
        </>
      )}
      {stage !== 'detecting' && !isExpired() && <Tip>{DEADLINE_TIP}</Tip>}
    </Card>
  )
}
