---
title: typescript type vs interface
date: '2021-11-19'
tags: [typescript]
---

# 背景

ts 中`type`和`interface`都是常用类型， 在实际开发中经常混用，顺着双休总结下 2 者的区别

### interface 只能描述 object

基础数据类型， 只能用 type 声明, 比如 `number`, `string`, `null`

```typescript
type info = string  // ✅
interface info = string // ❌
```

### interface 可以重名, type 不可以

> 实际运行时，重名的 interface 会自动合并, interface 不像 type 可以使用 & 合并功能

```typescript
interface IPerson {
  age: number
}

interface IPerson {
  name: string
}

// 上方等效于 type: type Person = { age: number } & { name: string }

const person: IPerson = {
  name: 'zhang',
  age: 10,
}

// 相当于如下
interface IPerson {
  age: number
  name: string
}
```

### interface 可以继承， type 不行

```typescript
interface Shape {
  name?: string
  getArea: () => number
}

interface ISquare extends Shape {
  width: string
  height: string
}

const squre: ISquare = {
  width: 10,
  height: 10,
  getArea: () => squre.width * squre.height,
}
```

### type 能使用计算属性

```typescript
type Keys = 'firstname' | 'surname'

interface IKeys {
  firstname: number
  surname: string
}

type DudeType = {
  [key in Keys]: string
}

// 或者

type DudeType2 = {
  [key in keyof IKeys]: IKeys[key]
}
```

## 总结

`type` 相对来说类型固定，支持原始类型，无法拓展, `interface` 更适合类库，可以被继承拓展。组件内部更适合`type`, 对外保留方法
更适合 `interface`
