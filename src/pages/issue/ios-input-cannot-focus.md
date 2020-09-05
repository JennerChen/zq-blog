---
title: ios输入框无法聚焦focus
date: '2020-08-31'
tags: ['无线', 'ios', 'css']
---

## 问题描述

今天突然发现所有 input 输入框无法输入， 初步排查原因是会自动失去焦点

## 原因

添加了 user-select 的样式

```css
input {
  user-select: none;
}
```

> ios 若改值设为 user-select: none; 那么会导致无法选中的情况。 android 没有问题

## 方案

重新设置 css

```css
input {
  user-select: text;
}
```

## Reference

- [input-field-ios-safari-bug-cant-type-in-any-text](https://stackoverflow.com/questions/32851413/input-field-ios-safari-bug-cant-type-in-any-text)
- [webkit-issue](https://bugs.webkit.org/show_bug.cgi?id=82692)
