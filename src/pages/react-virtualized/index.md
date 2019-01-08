---
title: react-virtualized
date: '2019-01-09'
tags: [react]
---

## 前言

本文主要介绍 `react-virtualized`, 使用版本`9.21.0`

前端开发会遇到一种棘手的情况: 渲染大量数据。首先, 这种情况要分析是否可以避免, 大致有如下的方式:

- 服务端分页

  > 减少一次返回的数据，前端可以使用列表或者表格的形式展现, 表格展示一般使用分页, 列表的话, 监听 onscroll 事件, 当快触底时, 加载更多数据

- 前端假分页

  > 获取的数据也许是第三方的数据,没有提供切片相关的接口, 只能前端分页。适用方式和服务端很类似,表格和列表均可适用(列表使用有点会有点奇怪)

- 图表渲染

  > svg 图表转换成 canvas

  > 数据聚合, zoom in/out。例如地图应用

- [windowing](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists)
  > `windowing`是 react 官方推荐的方法解决大数据渲染的办法, `react-window`是`react-virtualized`的阉割版,作者都是同一人

## 在使用之前

在使用 react-virtualized 之前,必须确认你是否真的需要它, 如果有可替换的方案, 我都建议优先使用替换方案。因为, 往往有更好的办法实现同样的需求, 它是最后的核武器了。

## 使用

`windowing`技术的核心就是 <b>只渲染可视部分的内容</b>

```bash
npm install react-virtualized --save
```

### `List` Api 介绍

```javascript
import { List } from "react-virtualized";
const data = [1,2,3,4,5];

<List
    // 窗口的高度,必填
    height={400}
    // 窗口的宽度,必填
    width={300}
    // 总共个数
    rowCount={data.length}
    // cell高度
    rowHeight={30}
    style={{ outline: "none" }}
    rowRenderer={({ key, index, isScrolling, style }) => {
        if(isScrolling){ return <div key={ key } style={ style }>滚动中...</div> }
        return <div key={ key } style={ style }>{ data[index] }</div>
    }}
</List>
```

这是最简单的使用,其中`height`,`width`必填,指明窗口的大小,你也可以使用`AutoSizer`实现动态宽高,查看这个[例子](https://bvaughn.github.io/react-virtualized/#/components/AutoSizer),

`rowCount`是总数, 这是必填的。

`rowRenderer`是组件渲染, 其中 `key`,`style`字段必须设置给你的每一个 item, 你可以使用 `data[index]`获取你的数据, `isScrolling`表示当前是否正在滚动。

`rowHeight`可以为固定数值或者一个函数返回一个数值, 结合 [`CellMeasurer`](https://bvaughn.github.io/react-virtualized/#/components/Masonry)可以获取动态内容的高度

另外, 可以使用 `ref`获取其 api, 调用[`scrollToPosition`](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#scrolltorow-index-number)可以平滑的滚动到指定的 index(搜索功能)

`List`是`Grid`的语法糖, 内部使用`Grid`的 api 实现的。[详见源码](https://github.com/bvaughn/react-virtualized/blob/master/source/List/List.js#L195-L207)

## 结论

记得第一次使用该库是 17 年，填了不少坑, 后面总结了经验, 然后到现在, 大概总共用到 4-5 次,相对来说使用频率很低。但是, 每次使用它开发完成后，成就感很高 😎。

> 另外, 掌握它, 还有一个很大的好处:

前端性能优化这个话题在面试属于一个加分问题,如果你能搬出`react-virtualized`并讲讲使用,难道不比那种[百度即可得](https://www.baidu.com/s?wd=%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96&rsv_spt=1&rsv_iqid=0xb92c06bb00030d06&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_sug3=11&rsv_sug1=11&rsv_sug7=100)的东西给人的印象更深刻？？
