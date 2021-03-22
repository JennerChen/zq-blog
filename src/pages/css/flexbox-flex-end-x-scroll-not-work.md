---
title: css flexbox flex-end scroll-x not working
commentIdentifier: flexbox水平滚动在flex-end模式下失效
date: '2021-03-20'
tags: ['css', 'mobile']
---

## 背景

在移动设备中， 右对齐弹性布局`flex-end` 会导致水平滚动失效。可以通过如下方式修复

不使用`flex-end`，用`flex-direction: row-reverse`替代

> 另外可以通过设置 direction: rtl 实现， 但实际不实用

## Reference

- [overflow-auto-not-working-with-justify-content-flex-end](https://stackoverflow.com/questions/47372148/overflow-auto-not-working-with-justify-content-flex-end)
