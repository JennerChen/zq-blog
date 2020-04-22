---
title: TextEncode 和 TextDecode 使用和介绍
date: '2020-04-23'
tags: [js]
---

# 背景

最近遇到一个线上解码 bug, 默认的 `String.fromCharCode` 转码乱码，初步查明原因是因为 `String.fromCharCode`仅支持`utf-16`编码，而我们使用的底层库返回的为`utf-8`(unit8Array)数据

## 解决办法

使用实验阶段的 `Encoding API`

```javascript
var uint8array = new TextEncoder('utf-8').encode('¢')
var string = new TextDecoder('utf-8').decode(uint8array)
```

> `Encoding API`处于实验阶段, ie 浏览器需要使用 polyfill

## Reference

- [The Encoding Standard defines encodings and their JavaScript API](https://encoding.spec.whatwg.org/)
- [polyfill encoding api](https://github.com/inexorabletash/text-encoding)
- [String.fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)
