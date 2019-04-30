---
title: react ssr 服务器端渲染 优点整理
date: '2019-01-28'
tags: [react, ssr]
---

## 背景

接触 react 差不多快 3 年了, 一直都是用的客户端渲染, 最新在做个人博客网站,所以对 react 服务端渲染进行了初步调研, 总结一下该何时使用 ssr

- SEO: 搜索引擎优化
- 数据预处理页面: 例如 个人博客, 门户首页, 产品宣传页面, 高访问量页面

### SEO

众所周知, react 项目由纯 javascript 组成, 会导致搜索引擎无法爬取内容, 如果你的网站是以流量为主的, 那么这是致命的问题。所以必须在服务器端将网站初始化执行一次, 获取首屏内容, 使用`react-helmet`等库将网页关键词生成供搜索引擎的 index

### 数据预处理

加载基于 javascript 前端项目, 用户会先获取一个空的 html 文件(白页),然后等待一系类的 js,css,ajax 请求完成, 最后渲染页面。最完美的优化白页的方式就是服务器端渲染好页面, 然后使用加载动画(建议 css 级别的)实现资源加载。
另外一种情况：新闻资讯网站。新闻资讯站点首页通常包含大量的类似请求, 可以将首屏渲染的结果渲染缓存, 当请求一致时, 直接返回结果。这样服务端可以避免重复接口请求,提供首页响应速度。

## SSR 实现原理

通常, reactDom 中,客户端使用 render 方法渲染页面。 服务器端使用 express 启动服务, 然后使用`renderToString`方法替换 index.html 页面中的内容。react 已经内置如何处理剩下来的逻辑了,用户不用为此特殊处理

```javascript{16-27}
import path from 'path'
import fs from 'fs'

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from '../src/App'

const PORT = 9090
const app = express()

const router = express.Router()

const serverRenderer = (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('An error occurred')
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    )
  })
}
router.use('^/$', serverRenderer)

router.use(
  express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
)

// tell the app to use the above rules
app.use(router)

// app.use(express.static('./build'))
app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})
```

## 实现框架

- [next.js](https://github.com/zeit/next.js):
  写个人博客的时候，首先试用了 next.js, 但是 next.js 对 SEO 的处理依然不好, 而且存在性能问题(我的服务器只有 512mb 内存,如果在服务器端执行渲染,会严重影响机器性能)。

- [gatsby](https://github.com/gatsbyjs/gatsby): 这是我最后的选择, gatsby 通过在`构建时`渲染页面, 这和 create-react-app 生成的结果完全一样, 不需要额外启动 node 服务器。最为一个非专业运维/后端, 这点很重要, 不需要处理你不擅长领域的内容。

## 如何选择框架

> 你认为 SEO 是最重要的

[gatsby](https://github.com/gatsbyjs/gatsby)

> 数据预处理最关键, SEO 次之

[next.js](https://github.com/zeit/next.js)

> 以上都不是你考虑的, 或者当下你不用考虑

请使用 create-react-app, ssr 只会增加你的使用成本, 他不会给你带来其他的优势。

## Examples

[mini-react-ssr-demo](https://github.com/JennerChen/mini-react-ssr-demo): 使用 create-react-app 最简单实现 ssr
