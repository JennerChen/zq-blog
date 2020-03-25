---
title: Intersection Observer API
date: '2020-03-26'
tags: [js]
---

在 mogul 实现[image 组件懒加载图片时](https://github.com/freshesx/mogul/commit/0dfc9e86e509093e9719543c15dbfe31c64f217c), 第一次接触到该 API, 当时由于开发紧张，故没有深入研究，现在有点空余时间，深入研究一下

## Intersection Observer API 用途

- 图片,内容懒加载
- 窗口无限滚动(当滚动到页面底部时, 自动加载更多资源,实现无限滚动)
  > 以前我通常使用监听滚动时间, 然后基于 `document.body.scrollHeight` 和 `document.body.scrollTop` 综合判定是否需要加载更多资源
  > react 大量窗口化技术库中，依然使用监听滚动时间来实现的
- 用户行为分析(埋点)

## 用法

```javascript
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0,
}

let observer = new IntersectionObserver(callback, options)

observer.observe(element)
```

> `root`一般无需指定，默认为 document.body(browser viewport)

> `threshold` 是周期频率的意思, 1 表明 callback 在元素完全显示时被执行，0 表示元素刚出现时被执行，若为数组, 则满足条件的情况下执行

## examples

20 行代码实现 React 的图片懒加载功能

```javascript{1-17,22-22}
let options = {
  rootMargin: '0px',
  threshold: 0,
}
function loadImage(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.getAttribute('src')) {
      entry.target.setAttribute(
        'src',
        entry.target.getAttribute('data-lazy-src')
      )
    }
  })
}

let observer = new IntersectionObserver(loadImage, options)

function Image({ src }) {
  let image = useRef()

  useEffect(() => {
    observer.observe(image.current)
  }, [])

  return (
    <div className={`img_container`}>
      <img ref={image} className={`img`} alt={`img`} data-lazy-src={src} />
    </div>
  )
}

export default function App() {
  return (
    <div className="App">
      <h1>图片懒加载</h1>
      <h2>向下滚动加载图片!</h2>
      <div style={{ marginBottom: 1000 }} />
      <Image
        src={
          'http://t7.baidu.com/it/u=3204887199,3790688592&fm=79&app=86&f=JPEG?w=4611&h=2969'
        }
      />
    </div>
  )
}
```

- [在 codesandbox 中打开](https://codesandbox.io/s/twilight-morning-jvnyw)

> 相比于监听 window.scroll 事件, 是不是更简单, 更高大上？

## Reference

- [MDN:Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
