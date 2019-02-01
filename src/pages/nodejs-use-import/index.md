---
title: 'nodejs 使用 import es7 语法'
date: '2019-02-01'
tags: ['nodejs', babel]
---

最近需要使用 [Hapi](https://hapijs.com/) 开发一些后端的相关东西, 但是 nodejs 的 require 让我很不爽, 故查询了一些办法能够直接使用 [es7 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语法
目标: 在代码中使用 `import path from "path"`

> 使用的是前端思维, 不知道有没有其他更好的办法

## require

- nodejs: v8+
- yarn/npm

## 安装

```bash
yarn add @babel/core @babel/polyfill @babel/register @babel/plugin-proposal-decorators @babel/preset-env --dev
```

- [@babel/core](https://babeljs.io/docs/en/babel-core) : babel 核心
- [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill) : 一些语法的 polyfill
- [@babel/register](https://babeljs.io/docs/en/babel-register) : @babel/core 和 nodejs 桥接工具
- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) : `import`语法就在这里面,外加一些其他的赠品(preset)
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) : 装饰器

入口文件 `index.js`, 复制一下内容

```javascript{13}
'use strict'

require('@babel/polyfill')
require('@babel/register')({
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true, // 必须这样设置, 否则装饰器会有一些限制
      },
    ],
  ],
  presets: ['@babel/preset-env'],
})

module.exports = require('./app') // 替换成真正的文件入口;
```

如果还需要其他的语法, 和 `babelrc`的设置方式一致

> 注意, 如果项目根目录包含 `babelrc`文件, 建议删除

即可在其他文件使用 `import`

## Reference

- [How To Enable ES6 Imports in Node.JS](https://timonweb.com/posts/how-to-enable-es6-imports-in-nodejs/) : 注意这篇文章使用的是 babel@6, babel@7 要用以上的方式
- [Using ES modules natively in Node.js](http://2ality.com/2017/09/native-esm-node.html) : 原生使用 import, 但不够成熟
