---
title: 'open graph protocol 使用'
date: '2023-08-02'
tags: ['html', 'SEO']
---

[The Open Graph protocol](https://ogp.me/) 属于 SEO 中的一部分， 在支持 og 协议的社交平台中把链接转为卡片渲染，能极大增加网页链接被点击率。 本文通过升级当前文档系统集成 og 标签，从而更进一步了解 og 协议

## 标签说明

### og:title

卡片标题

### og:description

卡片描述

### og:url

点击链接

![常用标签描述](./og-tags-1.png '常用标签描述')

其他一些标签详见文档

> 绝大部分社交平台不会执行 js, 故标签的生成必须在服务端

## 应用

### 使用 react-helmet 注入 关联 meta 标签

```jsx
import Helmet from 'react-helmet'
const meta = [
  {
    property: 'og:image',
    content: 'path-to-image',
  },
  {
    property: 'og:url',
    content: siteMetadata.siteOgUrl + slug,
  },
  {
    property: 'og:title',
    content: title,
  },
  {
    property: 'og:description',
    content: post.excerpt || tags.join(' '),
  },
]

const Head = () => {
  return <Helmet htmlAttributes={{ lang: 'cn' }} title={title} meta={meta} />
}
```

> gatsby 默认使用服务端渲染， 故无需关注其他问题

实际钉钉中效果
![钉钉中效果](./IMG_3842.jpg '钉钉中效果')

电报效果
![电报效果](./IMG_3843.jpg '电报效果')

## Reference

- [The Open Graph protocol](https://ogp.me/)
