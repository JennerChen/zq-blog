---
title: typescript tsconfig 备忘录
date: '2021-08-22'
tags: ['typescript', 'js']
---

# 背景

typescript 配置项很多，不像 js 有固定语法，实现一种功能根据配置有多种写法，配置不同会出现不同的
语法错误。本文主要分析主要的参数，提高自我对 ts 的理解能力

> 更准确的强烈推荐使用[官方文档](https://www.typescriptlang.org/tsconfig), 本文只是阐述个人的理解

## compileOptions

### target

编译结果版本，ts 本身可以直接替换 babel 编译代码，个人更喜欢使用 babel, 故 ts 的作用仅仅用于 typings。target 作用不大, 用 es5 即可

### exactOptionalPropertyTypes

默认是 false, 看如下代码

```typescript
interface UserDefaults {
  // The absence of a value represents 'system'
  colorThemeOverride?: 'dark' | 'light'
}
// 若 exactOptionalPropertyTypes 启用, 下方代码会报错， 因为 user.hasOwnProperty('colorThemeOverride') 为true
let user: UserDefaults = {
  colorThemeOverride: undefined,
}
```

### noImplicitAny

是否默认赋予所有值为 any, 默认为 false

> 这个值建议给 false, 若为 true, 相当于启用全局严格模式，不适合快速迭代项目

### noImplicitReturns

是否强制函数必须声明返回， 问题和 `noImplicitAny` 类似

### allowJs

是否允许 js, 一般建议开启

### checkJs

开启 js 后， 是否检查 js 文件

### skipLibCheck

跳过定义文件的检查，建议用默认的。 关闭后只会降低编译速度

### esModuleInterop

默认 false, commonjs 和 es6 标准不一致, 会导致不同导入方式存在区别，开启此功能能兼容 2 种标准

### allowSyntheticDefaultImports

默认 false, 但建议开启。 因为 ts 库会携带大量 typings, 若不开启智能手动引用，影响效率。

### forceConsistentCasingInFileNames

默认 false, 但建议开启。 因为不同操作系统对文件大小写有区别，此处可以强制区分大小写

### isolatedModules

默认 false, 是否开启独立模块。

混合 type 和普通 js 导出会产生运行时 bug, 开启此字段可以提示开发者分开导出

```typescript
import { someType, someFunction } from 'someModule'

someFunction()

// 开启后此处会报错
export { someType, someFunction }
```

需要修改成如下方式

```typescript
import { someType, someFunction } from "someModule";

someFunction();

export type { someType }

export { someFunction };
```

### jsx

react 才需要进行配置, 个人建议用 'preserve', 交由 babel 进行编译

### noEmit

默认 false, 若使用 babel 等工具编译时， 建议开启。ts 本身就不会出现错误，从而交给 babel 执行

## Reference

- [官方文档](https://www.typescriptlang.org/tsconfig)
