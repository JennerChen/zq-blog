---
title: webpack-vs-rollup-vs-parcel
date: '2020-08-16'
tags: [rollup, webpack]
---

现代前端构建工具层出不穷，webpack 是当前最流行的构建工具。但是如果希望打造高效可靠的前端工程，必须根据需求思考这些
工具的优缺点。

## webpack

简单易用，需要了解一些前端基础构建流程，简单配置即可达到可用状态。webpack 其实为资源打包器, 在复杂项目中，需要通过各种 loader 相互协作对不对资源进行处理
实现项目构建。webpack 版本较多，且参与开发人员众多，插件质量参差不齐，在复杂配置中对开发者要求非常高。

- 易用性: 简单
- 可配置性: 高
- 学习曲线: 高
- 流行性: ✨✨✨✨✨

> webpack 适用于业务项目，或者多资源复杂构建项目

### rollup

相对小众的 js 构建工具。 特别适合用于打包前端 library, 绝大部分的知名仓库均使用 rollup 作为构建工具。rollup 并不适合打包非 js 资源且插件种类较少，故不适用于复杂构建需求。
rollup 遵循`do one thing do it best`原则，开发者必须显示声明依赖而不是 webpack 的 externals，故能给开发者提供明确的依赖管理内容。

- 易用性: 中等
- 可配置性: 低
- 学习曲线: 高
- 流行性: ✨✨

> rollup 适用于 library

### parcel

parcel 是 0 配置工具, 与 create-react-app 类似。 用户一般无需再做其他配置即可开箱即用。 parcel 底层并不依赖 webpack, 而是独立一套机制。

- 易用性: 简单
- 可配置性: 低
- 学习曲线: 低
- 流行性: ✨✨✨✨

> parcel 适用于简单项目或者 demo 项目
