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
