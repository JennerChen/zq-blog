---
title: git clone不包含.git文件
date: '2020-06-06'
tags: ['git']
original: 'https://stackoverflow.com/questions/11497457/git-clone-without-git-directory'
---

## 背景

我需要从 git 下载一个模板, 但是又不像要.git 文件。

## usage

git 本身不支持该功能，但是可以通过 rm 手动移除

```bash
git clone --depth=1 --branch=master git://someserver/somerepo myTemplate
rm -rf ./myTemplate/.git
```

> `--depth=1 --branch=master` 不是必须的但是可以尽量减少下载的内容量
