---
title: node require 规则详解
date: '2019-08-19'
tags: [nodejs, npm]
---

在 es6 import 在 babel 转换后会变成 node 的 require。这点大家都知道。同时, 大家对 required 的机制只有大致了解。
例如, `require("jquery")`, 会获取 node_modules 下的 jquery。但是获取的具体规则却不是很了解。

# require 规则

## resolve 规则

如何解析路径的规则

```
require(X) from module at path Y
```

### X 是核心模块(core modules)

如果 X 是核心模块, 例如 fs, path, 那么直接返回核心模块

```javascript
const fs = require('fs')
```

### X 是第三方模块(thrid party modules)

本地模块指安装的依赖, 一般位于 node_modules 目录

如果 X 是第三方模块, 例如 react, axios, jquery, 那么直接返回该模块

```javascript
const axios = require('axios')
```

### X 以 `/`开始

如果 X 是绝对路径, 那么从 [filesystem root](https://stackoverflow.com/questions/9652043/identifying-the-file-system-root-with-node-js) 开始寻找模块

### X 以 `./` 或者 `../` 相对路径

从当前文件计算相对路径获取模块

## 加载规则

如何加载文件的规则

### 加载对象为文件

```text
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
4. If X.node is a file, load X.node as binary addon.  STOP
```

> 一句话就是 `X > X.js > X.json > X.node`

### 加载对象为目录

```
LOAD_INDEX(X)
1. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon.  STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. If "main" is a falsy value, GOTO 2.
   c. let M = X + (json main field)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATED
   g. THROW "not found"
2. LOAD_INDEX(X)
```

> 简单来说就是优先查看 package.json, 检测 main 字段, 如果存在,使用上方加载文件逻辑, 不存在使用 `LOAD_INDEX` 方法

## node_modules 解析规则

```
LOAD_NODE_MODULES(X, START)
1. let DIRS = NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = [GLOBAL_FOLDERS]
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```

## Reference

- [node modules](https://nodejs.org/api/modules.html#modules_all_together)： node modules 文档
