---
title: css 多语言 伪类(pseudo-class) lang
commentIdentifier: 'css 多语言 伪类(pseudo-class) lang'
date: '2022-02-20'
tags: ['css', 'i18n']
---

## 背景

近期项目国际化中， 需要根据语言使用不同的代码样式, 例如引号，句式，排版等。

## 使用

```text
:lang( <language-code> )
```

语言标签可以通过 meta 标签引入

```html
<html lang="en" />
<!--或者-->
<meta name="lang" content="en" />
```

也可以通过

```html
<div lang="en">
  ...
</div>
```

优先级规则和 css 保持一致

css 中获取

```css
/* Selects any <p> in English (en) */
p:lang(en) {
  quotes: '\201C''\201D''\2018''\2019';
}
```

## 总结

css lang 伪类能解决一部分 js 需要做的逻辑判定问题， 减少代码复杂度。 但是 lang 无法解决所有问题，有时候还是需要应用 js 处理一些内容和布局问题。

> css-in-js 方案更适合灵活页面，推荐 styled-components 可以把 css 变量变为 js, 让 css 的编程方式和 js 保持一致，减少编程语言的 gap

## Reference

- [css lang](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang)
- [css quotes](https://www.w3schools.com/cssref/pr_gen_quotes.asp)
- [styled-components](https://github.com/styled-components/styled-components)
