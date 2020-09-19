---
title: git cherry pick
date: '2020-09-19'
tags: ['git']
---

## 背景

`cherry pick`用于将特定的 commit 合并到分支，是以一个 commit 为维度。故一般用于将其他分支固定内容
合并到 master, 常用于临时发布或者 hotfix。

> merge 是以一个分支为维度

## usage

```bash
git cherry-pick [:hash]
```

或者仅仅将内容 add, 不进行 commit

```bash
git cherry-pick [:hash] --no-commit
```

## Reference

- [git cherry pick](https://www.git-tower.com/learn/git/faq/cherry-pick)
