import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { useCloudbase } from '../../cloudbase'
import PhoneSelector from './PhoneSelector'
import * as SUONE_API from '../../services/suone'

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

  const cloudbaseApp = useCloudbase()

  const [error, setError] = useState()

  const [phoneList, setPhoneList] = useState([])

  const [checkResult, setCheckResult] = useState()

  const [targetPhone, setTargetPhone] = useState('')

  const [gettingInfo, setGettingInfo] = useState(false)

  const getBalance = () => {
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
    const db = cloudbaseApp.database()

    const result = await db
      .collection('phone_use_record')
      .where({ phone, type: 'suone' })
      .count()

    if (result.total === 0) {
      db.collection('phone_use_record').add({
        phone,
        timestamp: new Date().getTime(),
        type: 'suone',
      })
    } else {
      db.collection('phone_use_record')
        .where({
          phone,
          type: 'suone',
        })
        .update({
          phone,
          timestamp: new Date().getTime(),
          type: 'suone',
        })
    }

    localStorage.setItem('prevPhone', phone)
  }, [])

  useEffect(() => {
    getBalance()
  }, [])

  useEffect(() => {
    if (cloudbaseApp) {
      const db = cloudbaseApp.database()
      db.collection('suone_phone_list')
        .doc('9d781d8a6a634ae8003e612919001827')
        .get()
        .then(doc => {
          if (doc && doc.data && doc.data[0].phoneList) {
            let pList = doc.data[0].phoneList
            setPhoneList(pList)

            const prevPhone = localStorage.getItem('prevPhone')
            const prevPhoneIndex = pList.indexOf(prevPhone)

            if (prevPhone && prevPhoneIndex > -1) {
              setTargetPhone(pList[prevPhoneIndex + 1] || pList[0])
            } else {
              setTargetPhone(pList[0])
            }
          }
        })
    }
  }, [cloudbaseApp])

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
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    let pPair = phone ? `&phone=${phone}` : ''

    return fetch(
      'https://api.d1jiema.com/zc/data.php?code=getPhone&token=' +
        accessToken +
        '&keyWord=SUONE' +
        pPair,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        console.log(result)
        if (result && result.startsWith('ERROR')) {
          if (phone) {
            const db = cloudbaseApp.database()
            const cleanPhoneList = phoneList.filter(p => p !== phone)

            db.collection('suone_phone_list')
              .doc('9d781d8a6a634ae8003e612919001827')
              .update({
                phoneList: cleanPhoneList,
              })
            setPhoneList(cleanPhoneList)
          }
          alert(`${phone} ${result}`)
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

        if (!phoneList.includes(nextPhone)) {
          const db = cloudbaseApp.database()
          db.collection('suone_phone_list')
            .doc('9d781d8a6a634ae8003e612919001827')
            .update({
              phoneList: [...phoneList, nextPhone],
            })

          setPhoneList([...phoneList, nextPhone])
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

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
        <strong>{balance}</strong>
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
