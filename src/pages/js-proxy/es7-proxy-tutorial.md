---
title: es7 proxy 用法笔记
date: '2019-08-13'
tags: ['es7']
---

es7 的 Proxy 虽然问世很久了, 但是在实际业务开发中很少使用。对他一直了解很少。这次通过深入了解响应式编程,顺便深入学习一下 Proxy。
Proxy 主要用于控制一个对象变量的增删改查的行为(取值, 赋值, 枚举, 方法调用等)

> `Proxy`不推荐在常规业务代码中使用

## usage

```javascript
let proxy = new Proxy(target, handler)
```

- `target`: 监听的对应, 通常是一个 object 对象

- `handler`: 相关`traps`(陷阱)集合, 类似于 React 中的生命周期

> `traps` 有很多相关方法, 精力有限不能一一讲解，主要解释一下响应式编程需要用到的几个

## traps

### get

用于获取对象的键值, 在响应式编程中, 通常需要在该方法中将监听的值加入当前的监听依赖之中

```javascript
{
  get(self, key) {
    // Avoid observing inherited keys.
    if (self.hasOwnProperty(key)) {
      // TODO 添加当前的值引用到依赖之中
    }
    return self[key];
  }
}
```

### set

用于设置对象的值, 在响应式编程中, 会执行该引用所有依赖的订阅

```javascript
{
  set: function(self, key, value) {
    let existValue = self.hasOwnProperty(key);
    let originalValue = self[key];
    self[key] = value;
    if (!existValue) {
      // TODO 这是一个添加操作

    } else if (originalValue !== value) {
      // TODO 这是一个添加操作

    }

    // 这里表明修改成功
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set#Return_value
    return true;
  }
}
```

### has

`has`用于`in`操作

```javascript
const handler1 = {
  has(target, key) {
    if (key[0] === '_') {
      return false
    }
    return key in target
  },
}

const monster1 = {
  _secret: 'easily scared',
  eyeCount: 4,
}

const proxy1 = new Proxy(monster1, handler1)
console.log('eyeCount' in proxy1)
// expected output: true

console.log('_secret' in proxy1)
// expected output: false

console.log('_secret' in monster1)
// expected output: true
```

### preventExtensions

## Reference

- [MDN Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
