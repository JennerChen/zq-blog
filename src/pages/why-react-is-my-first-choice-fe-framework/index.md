---
title: 为什么我选择react作为我第一优先前端框架
date: '2020-01-29'
tags: ['react', 'js']
---

过年在家，闲来无事，总结一下我为什么使用 react 的原因。

# 背景

起初, 使用 react 的原因很简单：公司项目需要迭代, 原有技术(jquery)已无法满足需求, 故需要切换为更现代的框架技术(angular, react, vue, knockout)。
由于小公司，没有能力做不同框架之间的调研，只能通过查询科技新闻(2015)，选择了 react。现在回想起来, 盲选的结果不错。

> 现在个人认为: 重大核心技术选择, 需要以<b>大厂</b>、<b>开源</b>、<b>Do One Thing and Do It Well(只做一件事)</b>优先。

一下是我整理我认为的 react 优点

## 强大的社区，稳定的维护

相较于 vue, 国内社区不如 vue, 但是除开国内, react 依然是当下第一前端框架。同时, 维护者和 angular 类似，都是顶级大厂。

> 强大的社区保证无需重复制造轮子，能够让开发者关注公司业务，项目本身

> 大厂出品非常重要，在技术转型初期，没人能确保成功。但是, 大厂起码能保证不差，且更容易获得上级的肯定

## 声明式编程

我个人认为<b>JSX</b>是 react 最大的特点, 我提供统一的 web 组件定义方式, 解决了之前不同框架，不同类库千奇百怪的 api 调用方式

## 平衡前沿稳定的前端发展

react 在前沿与稳定 2 个矛盾点做了不错的平衡

#### 前沿

react 拥有自己独创的 ui 算法, 在 2020 年依然属于较新技术。由于仅仅是 UI 库, 可以更好的和第三方类似组成自己定制的前端框架，做到高度个性化

#### 稳定

稳定性也是其他框架无法比拟的。

> react v16 版本从 17 年底发布, 保证 100%向下兼容

> 周边类库依然保持高度稳定(react-dom 100%与任意版本 react 兼容)，(redux 与 react v16 以上兼容)， (mobx 与 react v16 兼容)

> react 谨慎对待 api 的设计： 熟悉 react 的人会知道他内部会暴露大量`unstable_`开头的方法，这些方法因为未有更好的实现方式，故使用 unstable 告诉开发者请谨慎使用

## 精通 react 也是一种学习过程

前端不仅仅只有 react, 他只是 ui 的一部分。作为一个出色的前端，应该要掌握更多的地方。相较于 angular, vue, jquery, 他更让开发者不由自主的
学习更多领域的知识。

- react 有更高的学习曲线
- react 需要使用者自己决定使用哪些技术栈
- react 遵循`Do One Thing and Do It Well`原则
- react 更贴近原生

> 根据我认识的许多前端，通常来说，平均水平使用 react 的优于其他技术栈的

另外, 世界上不存在一种前端框架能够永存, javascript 才是永存的。故这也是 react 带来的优势

## Reference

[Unix philosophy: Do One Thing and Do It Well](https://techcrunch.com/2009/08/21/do-one-thing-and-do-it-well-40-years-of-unix/)
