---
title: 埋点 sendBeacon
commentIdentifier: 'sendBeacon api'
date: '2021-07-26'
tags: ['web', 'js']
---

# 背景

埋点分析通常使用图片或者 xhr, 但在一些特定条件下有可能无法正常发出请求，例如埋点记录页面关闭。sendBeacon 就用于这种特定的场景使用

## 使用方法

```javascript
navigator.sendBeacon(url)
navigator.sendBeacon(url, data)
```

其中 `url`就是请求地址，`data`可以是任意有效的 Post 数据类型。 与 xhr 不同，不会产生跨域问题。

常用方法: 在离开/隐藏页面发起埋点

```javascript
document.addEventListener('visibilitychange', function logData() {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/log', analyticsData)
  }
})
```

> ie11 不支持 Beacon API

##

## Reference

- [sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#return_values)
