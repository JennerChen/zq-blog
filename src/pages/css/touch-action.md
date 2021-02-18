---
title: css touch-action 应用
commentIdentifier: css touch-action 应用
date: '2021-02-18'
tags: ['css', 'mobile']
---

在触摸设备中滚动和 touch 其实是同时触发的，这在实际编程中带来了很多不便。css 中`touch-action`用于控制触控的行为

## usage

```css
.el {
  touch-action: none;
}
```

### none

禁用所有的手势操作， 由开发者自己控制滚动。 常用于在移动设备中实现拖拽能力

> `touchstart` 或者`touchmove` 事件中默认无法通过使用 e.preventDefault() 禁用滚动，必须设置此 css 才可以解决， [详见](https://developers.google.com/web/updates/2017/01/scrolling-intervention)

### auto

默认值

## reference

- [scrolling-intervention](https://developers.google.com/web/updates/2017/01/scrolling-intervention)
