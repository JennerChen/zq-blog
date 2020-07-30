---
title: systemjs介绍
date: '2020-07-30'
tags: [js]
---

## systemjs 背景

与传统 webpack 开发时构建不同, systemjs 着重于运行时构建。故 systemjs 更适合大规模零散开发集成项目。
systemjs 历史其实比 webpack 更久远, 最早用于 angularjs 模块集成。最近由于 chrome 最新版本支持`native import`一下子重新受到了关注

## 特性介绍

### 运行时加载

systemjs 类似于 amd, 在浏览器端执行模块加载而不是在构建时。 这极大的提高了代码灵活性，可以在运行时自由的加载新模块而不需要重新构建

### native import

systemjs 的写法和 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)非常相似, 若将来原生
`import`普及，可以直接无缝替换。这给开发者无限想象。

### systemjs

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/systemjs/6.4.0/system.min.js"></script>

<script type="systemjs-importmap">
  {
    "imports": {
      "react": "//unpkg.com/react@16/umd/react.development.js",
      "react-dom": "//unpkg.com/react-dom@16/umd/react-dom.development.js"
    }
  }
</script>

<script type="systemjs-module" src="./index.js"></script>
```

### native import

```html
<script type="importmap">
  {
    "imports": {
      "react": "//unpkg.com/react@16/umd/react.development.js",
      "react-dom": "//unpkg.com/react-dom@16/umd/react-dom.development.js"
    }
  }
</script>

<script type="module" src="./index.js"></script>
```

## Reference

- [Import maps](https://docs.google.com/document/d/1vFQzbmxg9ilpg8CT_P8roEYcpTfZ06Q5N4J9-ZQqqZo/edit): Import Maps v0.5 Implementation Design Doc
- [import-maps proposal](https://github.com/WICG/import-maps)

- [v8 js modules](https://v8.dev/features/modules)
