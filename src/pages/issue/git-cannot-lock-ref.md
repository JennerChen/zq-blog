---
title: 'git cannot lock ref'
date: '2020-09-18'
tags: ['git']
---

## 背景

无法执行git pull , 报类似于
```
error: cannot lock ref 'refs/remotes/origin/hotfix/0.1.0'
```

## usage

由于本地和远程 origin冲突，故需要删除本地下.git/refs/remotes/origin下的所有文件

```bash
rm -rf ./.git/refs/remotes/origin
git fetch
```

> 一般这个问题发生在windows中，mac我暂无出现过。

## Reference

- [github issue](https://github.com/desktop/desktop/issues/5438)
