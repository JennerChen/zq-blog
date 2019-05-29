---
title: '主要npm scripts使用说明'
date: '2019-05-29'
tags: [npm, nodejs]
---

## 背景

[npm scripts](https://docs.npmjs.com/misc/scripts)存在很多脚本, 例如 `npm publish`, `npm install/uninstall`等等。但是 npm 还支持很多在 package.json 中定义的 hooks 脚本
这里介绍一下常用的脚本

### prepublishOnly

适用于执行 npm publish 之前, 你需要运行脚本, 例如构建代码

### prepare

适用于执行 npm publish 或者 npm install, 我当前没有想到什么好的应用场景。

### postpublish

用于 npm publish 执行之后,调用。 例如推送代码到 git

### install

用于 npm install 时, 执行某个脚本。例如安装 node-sass, 每次都会执行一段[脚本](https://github.com/sass/node-sass/blob/master/scripts/install.js)

```json{7}
{
  "name": "node-sass",
  "version": "4.12.0",
  "libsass": "3.5.4",
  "scripts": {
    "coverage": "node scripts/coverage.js",
    "install": "node scripts/install.js",
    "postinstall": "node scripts/build.js",
    "lint": "node_modules/.bin/eslint bin/node-sass lib scripts test",
    "test": "node_modules/.bin/mocha test/{*,**/**}.js",
    "build": "node scripts/build.js --force",
    "prepublish": "not-in-install && node scripts/prepublish.js || in-install"
  }
}
```

> 注意, 和 prepare 不同, install 只会执行于被安装的包中。

> 按照个人的经验, 尽量避免使用`install`, 因为这会导致很多不可预见的问题。

> yarn 的 `build fresh package` 这一过程就是指执行 install 的脚本

## 自定义脚本

npm 也可以执行自定义的脚本, 例如

```json
{
  "name": "my-pkg",
  "scripts": {
    "dev": "echo hello my-pkg"
  }
}
```

你可以使用`npm run dev`执行
