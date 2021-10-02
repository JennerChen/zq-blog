---
title: overscroll禁用过度滚动
commentIdentifier: overscroll禁用过度滚动
date: '2021-10-01'
tags: ['css']
---

## 背景

mac 系统或者 ios 浏览器均有过度滚动(弹性滚动)的情况，后续所有的系统均支持了弹性滚动, 本文探讨如何禁用此特性

## 非 safari 浏览器

通过使用 `overscroll-behavior: contain` 禁用弹性滚动.
除 safari 外，所有的浏览器均支持(不支持的浏览器本身也不支持弹性滚动)

## safari

```css
html,
body {
  height: 100%;
  overflow: hidden;
}
```

safari 滚动只作用于 `html`, `body` 元素, 仅需禁止其滚动, 然后让其子元素滚动。

## 结论

综上，需要彻底解决问题

假设 html 如下

```html
<html>
  <body>
    <div id="root"></div>
  </body>
</html>
```

那么需要设置 css 为如下

```css
html,
body {
  height: 100%;
  overflow: hidden;
}

#root {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
}
```

## Reference

- [can i use overscroll-behavior](https://caniuse.com/mdn-css_properties_overscroll-behavior)
- [mdn overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
