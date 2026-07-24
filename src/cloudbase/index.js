import React, { useState, useMemo, useEffect } from 'react'

let app
let user

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

const getCloudbase = async () => {
  if (app) return app

  const cloudbase = await loadScripts(
    'https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js?v=1'
  )

  app = cloudbase.init({
    env: 'mj-test-d7ggejqzf7df8ef02', // 环境 ID
    region: 'ap-shanghai', // 地域，不传默认为上海地域
  })

  user = await app.auth().signInAnonymously({})

  return app
}

export default getCloudbase

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
