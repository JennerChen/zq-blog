---
title: window之间消息通讯
date: '2022-01-21'
tags: ['web', 'js']
---

## 背景

近期公司产品需要嵌入第三方平台，需要和平台页面进行一部分信息通讯，广泛使用了 `window.postMessage`, 本文主要介绍 postMessage 的使用和注意事项

## 使用

```javascript
targetWindow.postMessage(message, targetOrigin)
targetWindow.postMessage(message, targetOrigin, [transfer])
```

### targetWindow

targetWindow 需要为一个 window 对象， 常见使用方为

- window(同页面之间,实现 pubsub)
- window.parent(或者 window.top) 向父级推送消息
- window.frames[0].contentWindow(向 iframe 页面通讯)
- window.opener(向打开当前页面的推送)

### message

消息理论上支持所有可序列号类型, 内部会通过 [Structured_clone_algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)序列化后传递, 但是实际建议用 `string`减少奇怪问题

### targetOrigin

2 次验证 targetWindow 的 origin 是否符合， 若用 \* 代表所有。 如果 targetOrigin 不符合 targetWindow 的 origin 会拒绝发送， 控制台会报错。

> 敏感信息建议指定 origin，确保安全

### transfer

转换器, 通常用不到， 用于传输一些大数据。

## 接收

```javascript
window.addEventListener(
  'message',
  event => {
    if (event.origin !== 'http://example.org:8080') return

    // ...
  },
  false
)
```

### event.origin

来源 origin, 可以在此处检测是否合法合规

> 任何时候， 都应该检测 event.origin 是否合法

### event.data

上面 message 对象, 可能是所有类型， 但是建议用 string

### event.source

来源 window 对象， 可以通过该值实现 双向通信 `event.source.postMessage('收到消息', '*')`

## 总结

window.postMessage 可以向任何窗口推送消息（不论 origin 是否一致）， 可以通过 targetOrigin 做安全校验是否发送. 在接收方通过 `window.addEventListener("message", cb)` 获取消息， 通过`event.origin` 判定来源是否合法, `event.source` 获取来源 window 对象实现双向通信。

## Reference

- [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Structured_clone_algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
