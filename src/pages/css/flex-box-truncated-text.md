---
title: flex-box text-overflow 注意事项
date: '2021-04-30'
tags: ['css']
---

css text-overflow中与block中使用方式略有不同， 此处记录下。 

## 背景

文本无法overflow本质原因是flex布局下子元素非直接文本导致， 如果直接文本和普通block没有区别。 

```html
<div class="flex-parent">
  <div class="flex-child">
    Text to truncate here.
  </div>
  <div class="flex-child">
    Other stuff.
  </div>
</div>
```

```css
.flex-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

以上能正常`truncated`

但是， 若flex下存在子元素如下
```html
<div class="flex-parent">
  <div class="flex-child">
    <h2>Text to truncate here.</h2>
  </div>
  <div class="flex-child">
    Other stuff.
  </div>
</div>
```

```css
.flex-child > h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 解决方案

> 使用 `min-width: 0`

```css
.flex-child > h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
```

## Reference 

- [issue produce](https://codepen.io/aj-foster/pen/emBYPW)
