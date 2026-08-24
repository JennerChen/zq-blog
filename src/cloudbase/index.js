import React, { useState, useMemo, useEffect } from 'react'

let app
let user
let initPromise

function loadScripts(src) {
  return new Promise((resolve, reject) => {
    let s = document.createElement('script')
    s.src = src
    s.async = true
    document.head.appendChild(s)

    s.onload = () => {
      console.log('script loaded')
      resolve(window.cloudbase)
    }
  })
}

// 已通过短信验证码等方式登录时不再匿名登录, 避免覆盖真实登录态
const ensureLoginState = async cloudbaseApp => {
  const auth = cloudbaseApp.auth({ persistence: 'local' })

  try {
    if (typeof auth.hasLoginState === 'function' && auth.hasLoginState()) {
      return
    }
  } catch (e) {
    // 登录态探测失败时退回匿名登录
    console.error(e)
  }

  user = await auth.signInAnonymously({})
}

const initCloudbase = async () => {
  const cloudbase = await loadScripts(
    'https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js?v=1'
  )

  const cloudbaseApp = cloudbase.init({
    env: 'mj-test-d7ggejqzf7df8ef02', // 环境 ID
    region: 'ap-shanghai', // 地域，不传默认为上海地域
  })

  await ensureLoginState(cloudbaseApp)

  app = cloudbaseApp

  return app
}

const getCloudbase = async () => {
  if (app) return app

  // 并发调用时复用同一次初始化, 避免重复加载 SDK 与重复登录
  if (!initPromise) {
    initPromise = initCloudbase().catch(error => {
      initPromise = undefined
      throw error
    })
  }

  return initPromise
}

export default getCloudbase

export const getAuth = async () => {
  const cloudbaseApp = await getCloudbase()

  return cloudbaseApp.auth({ persistence: 'local' })
}

export const useCloudbase = () => {
  const [_, forceRender] = useState(1)

  useEffect(() => {
    if (!app)
      getCloudbase().then(() => {
        forceRender(v => v + 1)
      })
  }, [app])

  return app
}
