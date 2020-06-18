---
title: react statement management library比较
date: '2020-06-19'
tags: [react]
---

## 背景

react 我最喜欢使用什么状态管理库？这里是我对现有流行开源库的理解和比较

### setState

对新人最友好,最简单的`setState`。在 16.8 之后 `react hooks`出现解决了 react 组件模板过多的问题，大幅减少
了代码量，但是在复杂组件中与 class 模式相比代码相对难以维护

#### 优点

- 简单易用
- 不依靠 react 版本
- 适合 ui 组件开发(0 外部依赖)

#### 缺点

- 代码冗余且丑陋
- state 和 prop 逻辑冲突
- state 入门容易，用好很难

### context

简单方便上下文, 多层组件不用重复传递 prop

#### 优点

- 简单易用
- 适合 ui 组件开发(0 外部依赖)
- 避免多层组件重复传参

#### 缺点

- react 官方不推荐新手使用
- 更新 context 会导致全局重新渲染，性能堪忧

### Redux

最接近官方标准状态库的 Redux 是绝大部分 react 开发者首推的状态库

#### 优点

- 逻辑清晰，结构分层合理
- 性能很好(前提要有优化)

#### 缺点

- 学习曲线过高，难以学习
- 绝大部分项目没有必要使用
- 单数据中心

### mobx

react 是单向数据流，如果使用了 mobx，mobx+react 就变成双向数据流。

> 当 react 不允许使用 setState 时， 其实就是双向数据流

#### 优点

- 简单，快速，优雅
- 默认性能很好
- mobx 与 react 非强关联, 可与任意其他框架配合

#### 缺点

- 使用 Proxy, 非简单 object, 与 vue 类似
- 在 react 生态圈相对冷门
- 虽然默认性能优秀，但难以优化极致

> mobx 与 redux 相比, mobx 像自动挡汽车 简单高效 redux 是手动挡汽车 有乐趣且极致。

### apollo

我唯一没有使用过的状态库, 因为 apollo 适合于 graphql 后端形式，非 graphql 形式无法体现优点

### recoil

近期开源的状态管理框架，默认支持 react concurrent mode， 与 mobx 十分相似， 依然处于初期开发中

> 个人较看好 mobx 类型双向绑定状态库, 其能大幅提高开发效率

#### 优点

- 极简 api, 5 分钟记忆所有 api
- 默认性能很好
- 支持 concurrent mode
- facebook 官方状态库

#### 缺点

- 仍然在早期开发中，不稳定
- 最低支持 react v6.13+ , 兼容性差

## Reference

- [react concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html)
- [redux](https://github.com/reduxjs/redux)
- [apollo](https://github.com/apollographql/apollo-client)
- [mobx](https://github.com/mobxjs/mobx)
- [recoil](https://github.com/facebookexperimental/Recoil)
