---
title: typescript window 如何type
date: '2024-05-01'
tags: [typescript]
---

# 背景

业务代码中， 会涉及到大量从window读取自定义属性， 如何声明 window 很重要

```typescript
// ts error: Property 'X' does not exist on type 'Window & typeof globalThis'.
window.X;
```

## 解决方案

### 1) 重新声明 window 类型

window 本质上是 Window 类型， 那么直接可以通过全局声明重写

```typescript
declare global {
  interface Window {
    X: number;
  }
}

window.X // number
```

> global 是 ts中关键词，所有在 global 闭包中的会自动提升至全局。 此处必须用 interface 因为 interface 有自动合并的能力

### 2) 局部as

适用于临时解决

```typescript
(window as (typeof window & { X: number })).X // number
```


### 3) xx.d.ts 重写

所有 d.ts 文件自动会提升至全局

```typescript
// win.d.ts
interface Window {
  X: number;
}

// other.ts
window.X // number
```

## Reference

[interface 合并](https://zqblog.beaf.tech/ts-type-vs-interface/#interface-%E5%8F%AF%E4%BB%A5%E7%BB%A7%E6%89%BF%EF%BC%8C-type-%E4%B8%8D%E8%A1%8C)

[window 如何声明](https://www.totaltypescript.com/how-to-properly-type-window)

