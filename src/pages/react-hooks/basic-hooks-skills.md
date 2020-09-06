---
title: 'react hooks 基础用法'
date: '2020-09-06'
tags: ['react', 'react-hooks']
---

## 背景

本文主要介绍一下 react hooks 在开发中基础用法。内容按照方法归纳，使用方式可以想见官方文档，主要以
技巧为主

## 技巧

### 所有 hooks 严禁动态添加

```jsx{4}
function Comp({ visible, productId }) {
  let info = useState(null)
  if (visible) {
    //❌不要在此处动态返回 hook
    useEffect(() => {
      // get product by id
    }, [])
  }

  return <div />
}
```

> react hook 实现原理类似于事件注册机制, 在组件首次初始化时会确定顺序，不可改动。

### hooks 依赖中来自组件外或 setState 可以不写入依赖

```jsx
import { useEffect, useState } from 'react'
import { getProduct } from 'API'

function Comp({ visible, productId }) {
  let [info, setInfo] = useState(null)
  useEffect(
    () => {
      getProduct(productId).then(info => {
        setInfo(info)
      })
    },
    // ✅ 此处不用写 setInfo, 因为是state设置方法
    // ✅ 不写 getProduct 因为方法在组件外
    [productId]
  )

  return <div />
}
```

> 在组件中的 setState 在 react 内部保证了 immutable

## hooks

### useState

> 与 class 组件中 state 相对于的 hook, 方法与 setState 类似， 但是需要注意的是， 初始值只会在第一次生效，无法通过修改初始值重置 hook

```jsx
function Comp({ initCount = 0 }) {
  // ❌ 此处设计不严谨, 无法保证initCount不会变动
  // const [ count, setCount ] = useState(initCount)

  // ✅ 若需要根据prop自动重置state, 那么需要通过useEffect重新执行
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(initCount)
  }, [initCount])
  return count
}
```

### useEffect

> useEffect 用于模拟各种 react 生命周期

```jsx
// componentDidMount
useEffect(() => {
  console.log('componentDidMount')
}, [])

// componentWillMount
useEffect(
  () => () => {
    console.log('componentWillMount')
  },
  []
)

// componentDidUpdate
function Comp({ value }) {
  let ref = useRef({
    mounted: false,
    prevValue: undefined,
  })
  useEffect(() => {
    if (ref.current.mounted) {
      console.log('componentDidUpdate')
      console.log(`previous value: ${ref.current.prevValue}`)
      console.log(`current value: ${value}`)
    } else {
      ref.current.mounted = true
    }
    ref.current.prevValue = value
  }, [value])

  return value
}
```

### useRef

useRef 用于获取可变的内容，例如获取 dom 的引用

```jsx
function Comp({ value }) {
  let ref = useRef({})
  useEffect(() => {
    ref.current.focus()
  }, [value])

  return <input ref={ref} />
}
```

### useMemo

用于性能优化， 基础入门无需掌握

## Reference

- [react-hooks](https://reactjs.org/docs/hooks-intro.html)
