import cloudbase from '../cloudbase'

const commonFetchOptions = {
  method: 'GET',
  redirect: 'follow',
}

const request = url => {
  return fetch(url, commonFetchOptions).then(res => res.text())
}

export const getBalance = async accessToken => {
  return await request(
    'https://api.d1jiema.com/zc/data.php?code=leftAmount&token=' + accessToken
  )
}

export const getCode = async (accessToken, phone) => {
  return await request(
    `https://api.d1jiema.com/zc/data.php?code=getMsg&token=${accessToken}&phone=${phone}&keyWord=SUONE`
  )
}

export const getPhoneInfo = async (accessToken, phone) => {
  let pPair = phone ? `&phone=${phone}` : ''

  return await request(
    'https://api.d1jiema.com/zc/data.php?code=getPhone&token=' +
      accessToken +
      '&keyWord=SUONE' +
      pPair
  )
}

export const tapPhone = async phone => {
  const cloudbaseApp = await cloudbase()
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
}

export const getPhoneUseInfo = async () => {
  const cloudbaseApp = await cloudbase()
  const db = cloudbaseApp.database()
  const res = await db
    .collection('phone_use_record')
    .where({ type: 'suone' })
    // .orderBy('timestamp', 'desc')
    .limit(100)
    .get()

  return res.data || []

  // if (res && res.data && res.data.length > 0) {
  //   return res.data[0]
  // } else {
  //   return null
  // }
}

export const getHistoryPhoneList = async () => {
  const cloudbaseApp = await cloudbase()
  const db = cloudbaseApp.database()
  try {
    const doc = await db
      .collection('suone_phone_list')
      .doc('9d781d8a6a634ae8003e612919001827')
      .get()
    if (doc && doc.data && doc.data[0].phoneList) {
      return doc.data[0].phoneList
    }
    return []
  } catch (e) {
    return []
  }
}

export const addPhoneToHistory = async phone => {
  const cloudbaseApp = await cloudbase()
  const db = cloudbaseApp.database()

  const currList = await getHistoryPhoneList()

  if (currList.includes(phone)) {
    return currList
  } else {
    let updatePhoneList = [...currList, phone]
    db.collection('suone_phone_list')
      .doc('9d781d8a6a634ae8003e612919001827')
      .update({
        phoneList: updatePhoneList,
      })

    return updatePhoneList
  }
}

export const removePhoneInPhoneList = async phone => {
  const cloudbaseApp = await cloudbase()
  const db = cloudbaseApp.database()

  const currList = await getHistoryPhoneList()

  if (currList.includes(phone)) {
    let cleanPhoneList = currList.filter(item => item !== phone)
    db.collection('suone_phone_list')
      .doc('9d781d8a6a634ae8003e612919001827')
      .update({
        phoneList: cleanPhoneList,
      })
    return cleanPhoneList
  } else {
    return currList
  }
}
