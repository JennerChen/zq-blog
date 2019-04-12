---
title: 'package.json中main,jsnext:main,module的区别'
date: '2019-04-12'
tags: [npm, nodejs]
---

package.json 中存在一些特殊字段, main,jsnext:main,module 的区别。经常使用 npm 发布包时会用到他们。
但很多人无法理解具体区别，故在此阐明。

- main: main 字段指明包的入口文件位置,默认 index.js。这里的文件应该放置 commonJs(cjs)模块, 如果源码需要被编译才能使用,那么此处的文件就必须已经被编译了

- jsnext:main: 有一些工具,例如 webpack 能直接处理 `import`方式导入的模块。如果开发者希望自己的包交由使用者决定如何引入,那么可以将源码编译成[ECMA(esm)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

- module: 与 jsnext:main 意义一样。但是 jsnext:main 是社区约定的字段,并非官方。而 module 则是官方字段。但是社区包含大量的插件只认识 jsnext:main,所以推荐同时使用 jsnext:main 和 module

| 字段        | 描述                                                         | 文件格式 |
| ----------- | ------------------------------------------------------------ | -------- |
| main        | nodejs 默认文件入口, 支持最广泛                              | cjs      |
| jsnext:main | 社区约定的 esm 文件入口, webpack, rollup 均支持该字段        | esm      |
| module      | esm 官方约定入口, 支持插件较少,故推荐和 jsnext:main 同时使用 | esm      |

最后, 用代码演示cjs和esm编译后代码的主要区别:


```javascript
// CommonJS(cjs)
const { foo } = require('./bar')

const baz = foo + "qux"

module.exports = {
  quux: [baz]
}
```

```javascript
// ECMA module(esm)
import { foo } from './bar.js'

const baz = foo + "qux"

export const quux = [baz]
```
