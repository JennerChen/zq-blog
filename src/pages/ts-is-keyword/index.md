---
title: typescript is keyword
date: '2022-08-06'
tags: [typescript]
---

# 背景

ts 中`is`关键词和特殊， 最近深入了解了下， 下面作为笔记

### is 作用

`is` 关键词用于类型推断， 和`as`类似， 区别是`as`可以在函数里面使用， `is`用于函数的返回定义, 改变的是整个上下文

```typescript
type Fish = {
  swim: () => void
}

type Bird = {
  fly: () => void
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```

### is 的使用

典型的判定类型方案， 若期望使用更精准的类型， 不要简单在函数做出 boolean 类型， 而是设置入参为 期望的类型， 那么后续闭包中该对象会自动解析成 `is`的类型

```typescript
// 返回类型指定 入参为 string, 那么上下文能自动推断
function isString(test: any): test is string {
  return typeof test === 'string'
}

function example(foo: any) {
  if (isString(foo)) {
    // 此处ts 上下文能自动识别 foo 是 string 而不是 any
    console.log('it is a string' + foo)
    console.log(foo.length) // string function
  }
}
example('hello world')
```

## Reference

- [using-type-predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
