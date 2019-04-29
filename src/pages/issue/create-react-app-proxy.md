---
title: create-react-app 中 proxy 参数和 http-proxy-middleware 不一致
date: '2019-04-29'
tags: ['webpack']
---

在研究 create-react-app 源码之中, 已经了解到其所用的 webpack-dev-server 插件内部使用 proxy-http-middleware 作为 proxy 工具, 但是最近遇到一个问题，行为表现和 proxy-http-middleware 不一致。经过研究, 最后整理如下

## 问题描述

存在如下代理

```json
{
  "proxy": {
    "/A/": {
      "target": "http://www.baidu.com"
    },
    "/C/A": {
      "target": "http://www.google.com"
    }
  }
}
```

查询 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#context-matching)文档后,预期是这样的, 访问以

- `/A`: 开头的请求都代理到`http://www.baidu.com`
- `/C/A`: 开头的请求都代理到`http://www.google.com`

但是实际请求都会被代理到`http://www.baidu.com`。

> create-react-app v2 已经不允许使用这种方式设置代理, 但是我们存在不少项目依然使用这种方式设置。[详见](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#docsNav)

## 追踪问题

翻阅 create-react-app 源码, 发现其 context 是自定义的转发,

```javascript{2-6}
Object.assign({}, proxy[context], {
  context: function(pathname) {
    // mayProxy 是检测是否为静态文件
    // pathname.match(context) 检测是否代理
    return mayProxy(pathname) && pathname.match(context)
  },
  onProxyReq: proxyReq => {
    // Browers may send Origin headers even with same-origin
    // requests. To prevent CORS issues, we have to change
    // the Origin to match the target URL.
    if (proxyReq.getHeader('origin')) {
      proxyReq.setHeader('origin', target)
    }
  },
  target,
  _context_: context,
  onError: onProxyError(target),
})
```

`mayProxy(pathname) && pathname.match(context)`并没有判断需要从开始判断, 故导致了上述问题

## 解决办法

在路由之前增加`^`标识, 这是 js 正则 `pathname.match(context)`

```json
{
  "proxy": {
    "^/A/": {
      "target": "http://www.baidu.com"
    },
    "^/C/A": {
      "target": "http://www.google.com"
    }
  }
}
```

```javascript
;`/C/A/search`.match(`/A`) //["/A", index: 2, input: "/C/A/search", groups: undefined]
;`/C/A/search`.match(`^/A`) // null
```

## Reference

- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#context-matching)
