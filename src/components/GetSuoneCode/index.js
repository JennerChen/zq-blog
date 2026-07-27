import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { useCloudbase } from '../../cloudbase'
import PhoneSelector from './PhoneSelector'
import * as SUONE_API from '../../services/suone'
import {
  addPhoneToHistory,
  getHistoryPhoneList,
  removePhoneInPhoneList,
} from '../../services/suone'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const LoadingMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
`

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const GlobalLoading = () => (
  <LoadingMask>
    <Spinner />
  </LoadingMask>
)

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  max-width: 90%;
  margin: 24px auto;
  padding: 16px 24px;
  color: #d8000c;
  background: #ffecec;
  border: 1px solid #ffbaba;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  word-break: break-word;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 16px auto;
    padding: 12px 16px;
    font-size: 14px;
  }
`

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
  font-size: 20px;
  font-weight: 600;
  color: #222;
  text-align: center;
`

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 4px;
  color: #666;
  font-size: 15px;
  background: #f7f9fc;
  border-radius: 8px;

  strong {
    color: #409eff;
    font-size: 18px;
  }
`

const BalanceValue = styled.span`
  display: inline-flex;
  align-items: center;
`

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 8px;
  padding: 0;
  color: #409eff;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 16px;
    height: 16px;
  }

  &:disabled {
    color: #a0cfff;
    cursor: not-allowed;
  }

  &:disabled svg {
    animation: ${spin} 0.8s linear infinite;
  }
`

const RefreshIcon = () => (
  <svg viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
    <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 0 0-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 0 1 655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 0 1 279 755.2a342.16 342.16 0 0 1-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 0 1 109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z" />
  </svg>
)

const QueryButton = styled.button`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  margin-top: 16px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
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

export default ({ accessToken }) => {
  const [balance, setBalance] = useState()

  const [error, setError] = useState()

  const [phoneList, setPhoneList] = useState([])

  const [checkResult, setCheckResult] = useState()

  const [targetPhone, setTargetPhone] = useState('')

  const [gettingInfo, setGettingInfo] = useState(false)

  const [refreshingBalance, setRefreshingBalance] = useState(false)

  const getBalance = () => {
    setRefreshingBalance(true)
    SUONE_API.getBalance(accessToken)
      .then(result => {
        if (typeof result === 'string') {
          if (result.startsWith('ERROR')) {
            setError(result)
          } else {
            setBalance(result)
            setError(undefined)
          }
        }
        console.log(result)
      })
      .catch(error => {
        setError('服务不可用')
      })
      .finally(() => {
        setRefreshingBalance(false)
      })
  }

  const getCode = useCallback(async function(phone) {
    setGettingInfo(true)

    try {
      const result = await SUONE_API.getCode(accessToken, phone)
      if (result) {
        setCheckResult(result)
        await tapPhone(phone)
      }

      console.log(result)

      // await tapPhone(phone)
    } catch (error) {
      console.error(error)
    } finally {
      setGettingInfo(false)
    }
  }, [])

  const tapPhone = useCallback(async phone => {
    await SUONE_API.tapPhone(phone)
    localStorage.setItem('prevPhone', phone)
  }, [])

  useEffect(() => {
    getBalance()
  }, [])

  useEffect(() => {
    SUONE_API.getHistoryPhoneList().then(pList => {
      setPhoneList(pList)

      const prevPhone = localStorage.getItem('prevPhone')
      const prevPhoneIndex = pList.indexOf(prevPhone)

      if (prevPhone && prevPhoneIndex > -1) {
        setTargetPhone(pList[prevPhoneIndex + 1] || pList[0])
      } else {
        setTargetPhone(pList[0])
      }
    })
  }, [])

  const handlePhoneSelect = useCallback(async phone => {
    setGettingInfo(true)
    try {
      const flag = await checkPhone(phone)
      if (flag) setTargetPhone(phone)
    } catch (e) {
    } finally {
      setGettingInfo(false)
    }
  }, [])

  const checkPhone = phone => {
    return SUONE_API.getPhoneInfo(accessToken, phone)
      .then(result => {
        if (result && result.startsWith('ERROR')) {
          if (phone) {
            SUONE_API.removePhoneInPhoneList(phone).then(result => {
              setPhoneList(result)
            })
            alert(`${phone} ${result}`)
          }
          return false
        } else {
          return result
        }
      })
      .catch(error => console.error(error))
  }

  const handleOnMore = useCallback(async () => {
    try {
      setGettingInfo(true)
      const nextPhone = await checkPhone('')
      setGettingInfo(false)

      if (nextPhone) {
        handlePhoneSelect(nextPhone)

        const nextPhoneList = await SUONE_API.addPhoneToHistory(nextPhone)
        setPhoneList(nextPhoneList)
      }
    } catch (e) {
      console.error(e)
    }
  }, [phoneList])

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  if (typeof balance === 'undefined') {
    return <GlobalLoading />
  }

  return (
    <Card>
      <Title>金地广场停车</Title>
      <BalanceRow>
        <span>余额</span>
        <BalanceValue>
          <strong>{balance}</strong>
          <RefreshButton
            title="刷新余额"
            disabled={refreshingBalance}
            onClick={getBalance}
          >
            <RefreshIcon />
          </RefreshButton>
        </BalanceValue>
      </BalanceRow>
      <PhoneSelector
        selectedPhone={targetPhone}
        phoneList={phoneList}
        onSelect={handlePhoneSelect}
        onMore={handleOnMore}
      />

      {gettingInfo && <GlobalLoading />}

      <QueryButton
        disabled={!targetPhone || gettingInfo}
        onClick={() => getCode(targetPhone)}
      >
        查询
      </QueryButton>

      {checkResult ? <ResultBox>{checkResult}</ResultBox> : null}
    </Card>
  )
}
