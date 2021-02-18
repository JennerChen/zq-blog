---
title: in vs hasOwnProperty
date: '2020-12-22'
tags: [js]
---

## 背景

最近在阅读一些底层库时，发现都会使用`in`操作符，而不是`hasOwnProperty`。 和我个人经验略有区别，故查询了些资料，作为 2 者对比。

## 共同点

```javascript
const obj = { answer: 42 }
'answer' in obj // true
obj.hasOwnProperty('answer') // true

'does not exist' in obj // false
obj.hasOwnProperty('does not exist') // false
```

都支持[es6 symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

```javascript
const symbol = Symbol('answer')
const obj = { [symbol]: 42 }

symbol in obj // true
obj.hasOwnProperty(symbol) // true
```

## 不同点

`in` 操作符会返回 true 原型链中的属性, `hasOwnProperty` 不会。所以, `hasOwnProperty` 无法获取 es6 中 class getter, settor 中的字段

```javascript
'constructor' in obj // true
'__proto__' in obj // true
'hasOwnProperty' in obj // true

obj.hasOwnProperty('constructor') // false
obj.hasOwnProperty('__proto__') // false
obj.hasOwnProperty('hasOwnProperty') // false
```

```javascript
class BaseClass {
  get baseProp() {
    return 42
  }
}
class ChildClass extends BaseClass {
  get childProp() {
    return 42
  }
}
const base = new BaseClass()
const child = new ChildClass()

'baseProp' in base // true
'childProp' in child // true
'baseProp' in child // true

base.hasOwnProperty('baseProp') // false
child.hasOwnProperty('childProp') // false
child.hasOwnProperty('baseProp') // false
```

主要区别如下表

|                      | in  | hasOwnProperty |
| -------------------- | --- | -------------- |
| Symbols              | ✅  | ✅             |
| inherited properties | ✅  | ❌             |
| es6 getter/setters   | ✅  | ❌             |

## 应用场景

`in` 更适合获取是否有方法的对象，通常来说， 你希望检查之后， 直接执行这个方法，用于检测方法是否存在。
`hasOwnProperty` 适合 plain object, 查看对象是否真正存在， 在业务场景中更适用。

> 这就能解释，为什么大量底层库均适用`in`而不是`hasOwnProperty`。 越抽象的库，往往数据间交互已经不是 plain object, 而是封装 class 对象了

## Reference

- [es6 symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
