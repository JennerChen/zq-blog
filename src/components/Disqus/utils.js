import ping from 'web-pingjs'

export function insertScript(src, id, parentElement) {
  const script = window.document.createElement('script')
  script.async = true
  script.src = src
  script.id = id
  parentElement.appendChild(script)

  return script
}

export function removeScript(id, parentElement) {
  const script = window.document.getElementById(id)
  if (script) parentElement.removeChild(script)
}

export function debounce(func, wait, runOnFirstCall) {
  let timeout
  return function() {
    const context = this // eslint-disable-line consistent-this
    const args = arguments

    const deferredExecution = function() {
      timeout = null
      if (!runOnFirstCall) func.apply(context, args)
    }

    const callNow = runOnFirstCall && !timeout

    window.clearTimeout(timeout)
    timeout = setTimeout(deferredExecution, wait)

    if (callNow) func.apply(context, args)
  }
}

let lastCheckTime = null
let isBlockByGFW = false
let isPinging = false
let checkPromise = null

/**
 * 检测 disqus 在客户端是否可以访问
 * 因为会存在多个组件同时调用,为了性能考虑, 故做了流量控制
 * @returns {Promise}
 */
export function checkIsBlockByGFW() {
  // 如果正在请求, 直接返回缓存的promise
  if (isPinging) {
    return checkPromise
  }

  // 检测距离上次检测时间是否小于30s, 如果是, 封装成promise, 直接返回
  if (lastCheckTime && lastCheckTime + 30 * 1000 <= new Date().getTime()) {
    return isBlockByGFW
      ? Promise.reject(new Error('Timeout'))
      : Promise.resolve(true)
  }

  // 既没有缓存请求, 也超过了超时时间, 重新检查
  lastCheckTime = new Date().getTime()
  isPinging = true
  checkPromise = ping('https://links.services.disqus.com')
    .then(() => {
      isBlockByGFW = false
    })
    .catch(() => {
      isBlockByGFW = true
    })
    .finally(() => {
      // 重置状态
      isPinging = false
      checkPromise = null;
    })
  return checkPromise
}
