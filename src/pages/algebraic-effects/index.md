---
title: algebraic effects 是什么
date: '2020-11-10'
tags: [react, js]
---

## 前言

react hooks 底层机制参考了 algebraic effects，但在网上搜索这个词汇，大多都是偏学术的，我不擅长谈论学术，只能根据个人经验对 algebraic effects 做一些相关思考

## 什么是algebraic effects

简单来说， 其实就是 `try/catch` 的一种变体。 algebraic effects 主要解决2个问题

- 抛错后无法继续执行

```javascript
function logName(name){
  if(!name) throw "need name input"
  console.log(name)
}

function otherStuff(){
  // ...
}

try {
  logName()
  otherStuff()
} catch(error) {
  
}
```

上述代码若入参`name`缺失， 会直接停止执行， 导致后续 `otherStuff`方法不被执行。algebraic effects就是解决此类问题的方式，
通过增加一个关键词`effect`或者`perform`, 既能抛出错误，也能同时恢复代码继续执行

参考如下代码(`effect`, `resume`为假定关键词)

> `effect`, `resume` 关键词当前不存在，仅假设！

```javascript
function logName(name){
  if(!name) effect "need name input"
  console.log(name)
}

function otherStuff(){
  // ...
}

try {
  logName()
  otherStuff()
} catch(error) {
  if(error === 'need name input') {
    resume "Tom"
  }
}
```

同时algebraic effects也支持`async/await`

```javascript
try {
  logName()
  otherStuff()
} catch(error) {
  if(error === 'need name input') {
    resume await fetch("fetch default name url")
  }
}
```

- 面向切片编程(Aspect-Oriented Programming)

自从工作以来, 似乎就没有接触过AOP，依稀记得在大学期间学习java有过短暂接触。algebraic effects主要通过分割无关内容，让开发者更聚焦同一份工作职责(更加模块化)


> 当前js可以通过 [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 实现类AOP能力

## 值不值的使用

algebraic effects比继承，接口，minin, 对代码本身侵入性更少(不改变原型链)， 又比装饰器(Dependent Inject)灵活性更高(可以控制代码任意执行顺序)。 特别适合在大型系统层级分明的架构之中。
另外react hooks 也是基于理论实现的。 但是根据个人经验，在前端领域里面几乎不存在大型系统。

- 技术在不停向前: java 10年前和现在还是那些主流框架， 但是前端近几年从jquery->angular,vue,react的演变, 后面还有大量后起之秀挑战。 
- js没有编译时: 虽然有babel, 但也仅仅是语法转换没有改变本质。AOP更适合静态语言
- Generator比`async/await`更早出现，但依然输给了`async/await`, 前端更适合简单易懂的语法
- `try/catch`的缺点对实际开发并无太多影响

## Reference

- [Aspect-Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)
- [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
