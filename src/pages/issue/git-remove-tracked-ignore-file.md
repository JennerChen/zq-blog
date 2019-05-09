---
title: git 移除 tracked的文件
date: '2019-05-09'
tags: ['git']
---

## 问题描述

由于历史或者误操作原因, 可能很多人会将一些个人配置文件加入 git。后期优化代码时, 又将这些文件放入 `.ignore`中
你会发现这些 ignore 的文件依然还会被 git 跟踪，故使用如下方法可以完美解决

```bash
git rm --cached <file>
```

例如 `git rm -cached -r .idea`: 它会将所有.idea 配置文件全部删除(不会删除实体文件,只是清楚 git 缓存)
