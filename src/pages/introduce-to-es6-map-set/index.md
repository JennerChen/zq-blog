---
title: 前端性能优化之Map Set
date: '2020-03-13'
tags: [es6, js, performance]
---

# 背景

前端业务系统遇到性能问题主要有 3 种

- 网络请求过多
- dom 滥用
- [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) 数组循环 算法过多

本文主要解决 [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) 问题

> 另外 2 种情况 `网络请求过多`, `dom滥用` 的问题，我会另外写一篇文章总结

在实际业务中, 往往从服务端获取的数据不是真正 UI 想要的，故必须对数据进行一个操作(过滤，排序，格式化等)。然而, UI 又会随着业务的发展不断变化，这会导致
需要不断的迭代数据操作的逻辑，使得操作逻辑越来越复杂。 当操作的数据量达到一定程度时, 页面出现假死的现象，这就出现了前端性能问题。

而解决这个性能问题的核心关键，就是建立数据缓存(索引)

> 将 复杂度 O(n\*m) 转换为 O(n+m)

例如如下例子:

```javascript
let data = new Array(1000).fill().map( (d,index) => ({
    money: Math.ceil(Math.random() * 100),
    id: index + 1
}) );
// 求和
let sum = data.reduce( (curr, ({ money })) => curr + money ,0 )

// 寻找id为10的金额
let target = data.find( ({ id })) => id === 10 )

// 删除id为10的账户金额
let filterData = data.filter( ({ id })) => id === 10 )

// 更新数据
let newData = [{ id: 1, money: 20 }, { id: 2, money: 10 }, { id: 3, money: 30 }];
// 若想实现更新数据, 那么如下算法性能消费极大
// 复杂度 O(n*m)
data.map( d => {
    let target = newData.find( ({ id,money }) => {
        return d.id === id;
    })

    if(target){
        return target;
    } else {
        return d
    }
} )
```

解决方案就是使用 Map 和 Set

## Map

es6 Map 主要用于频繁性更新, 修改的操作

```javascript
let data = new Array(1000).fill().map((d, index) => ({
  money: Math.ceil(Math.random() * 100),
  id: index + 1,
}))

let dataMap = data.reduce((map, d) => {
  map.set(d.id, d)
  return map
}, new Map())

// 更新数据
let newData = [{ id: 1, money: 20 }, { id: 2, money: 10 }, { id: 3, money: 30 }]
// 复杂度 O(n+m)
newData.forEach(d => {
  dataMap.set(d.id, d)
})
```

### 使用 Map 的场景

- Map 的 key 可以使用任意类型, 例如 `string`,`number`, `symbol`, 甚至 `object` , 故适用于 key 未知的场景
  > `map.get("1") !== map.get(1); 获取的不是同一个值！`
- Map 保留加入的顺序，且顺序不可更改（该特性有利且有弊）
- Map 更纯净, 不会包含额外的 object 方法

### 使用 object 场景

- 需要数据序列化(`json.stringify`)
- 固定 key 类型(`string`)
- 简单数据结构, 无需频繁添加删除 key

## Set

Set 与 Array 的主要区别在于, Set 不允许重复, 是一种更严格的 array

> Set 使用 `===` 判断是否一致

Set 相较于 Map 实际应用场景较少，没有太大的优势。在实际业务中，一般用于排重

```javascript
let arr = ['😁', 'a', 'b', 'c', '😁', 'a']

Array.from(new Set(arr)) // ["😁","a", "b", "c" ]
```

> Set 相较于 Array 性能稍差， 同理 Map 相较于 object 性能稍差。但是正常使用没有多大区别。 因为这些性能只能算是线性的 O(n+m)，而不是 O(n\*m)。
> 个人见解: 解决 O(n+m)的问题，需要是解决网络请求或者 dom 滥用!

## 参考资料:

1. https://medium.com/front-end-weekly/es6-map-vs-object-what-and-when-b80621932373
2. https://medium.com/front-end-weekly/es6-set-vs-array-what-and-when-efc055655e1a
3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
4. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
5. https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object
6. https://en.wikipedia.org/wiki/Big_O_notation
