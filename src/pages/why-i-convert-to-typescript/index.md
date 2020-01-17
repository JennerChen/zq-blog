---
title: 我为何使用typescript
date: '2020-01-15'
tags: ['typescript', 'js']
---

# 背景

我最终打算将我的项目慢慢向 typescript 迁移了，不是因为原生 javascript 不好，而是遇到了其无法解决的问题。如下是我总结的原因

## 手写文档太痛苦

我当前使用手动写`d.ts`文件来实现客户端代码的自动补全和提示, 这种方式不论在 webstorm, 还是 vscode,效果相当不错。起初，这没有什么问题。但是随着版本的迭代, 我发现如若修改一点点的内容，我必须手动
去修改相关文档。而这原因导致我多次重新发布版本。故我希望将文档和代码合并, typescript 能够很完美的解决这个问题

> 个人认为: 手动写 `d.ts`, 虽然会存在遗漏功能，写法不准确上有不妥。但是，内容一定是可读性高，特别适合内部团队使用(因为有统一的风格约定)

> 为何不使用 jsdoc 将文档和代码合并 ? jsdoc 是一个简易的方案，且绝大部分开发者都能理解文档的内容。但为了让第三方使用依然无法避免写`d.ts` ，又需要我们同时维护 2 份代码

## 更好的重构代码

在项目刚开始开发时，需求不稳定, 但是随着约 2 年的开发，大致内容已经固定，但是又面对了向下兼容的风险。
传统 js 使用测试来保证向下兼容。但是使用测试不能够满足多变的 ui 框架,且接近 100%测试覆盖率极难且费时费力。故使用 typescript 能够帮我大幅减轻重构代码时的风险。

> 在传统业务代码中，我依然推荐首选 javascript, 若项目为多人合作前端工程，可以选择 typescript.

## typescript 不是下一个 coffee script

早在, 16 年我就关注 typescript, 但是迟迟不愿意学习。一个很大的原因, 我怕他是下一个 coffee script。coffee script 相对于 javascript 拥有简洁的语法, 深受资深前端的喜爱，但始终属于小众语言。
typescript 重点解决 javascript 静态类型检测功能，同年, flow 也是解决类似问题。 但是这要求开发者学习新的 type 语法。另外, es6, es7 开始流行, 代码可读性已经大幅提高。故我放弃了学习 typescript。

> 另一个很重要的原因, typescript 来自微软, 故当时我个人更愿意学习 flow 而不是 typescript

但是, 时代在变化, 已经很明显, 静态类型检测对 javascript 很重要, typescript 将来会成为一种趋势。我个人认为 typescript 会是未来 5 年前端趋势之一。

![typescript vs flow-bin npm downloads](https://beaf-fs-public.oss-cn-hangzhou.aliyuncs.com/WeChatWorkScreenshot_4ad1c260-f6f0-4488-99f1-415615103403.png)
