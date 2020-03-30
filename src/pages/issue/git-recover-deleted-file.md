---
title: git 恢复被删除的文件
date: '2020-03-30'
tags: ['git']
original: 'https://gitguys.com/repositories/how-to-recover-a-deleted-a-file-from-my-git-repository/'
---

## 背景

我需要回滚在许久之前被废弃的模块。

## usage

通过 git GUI 很难查看一个被删除文件/目录的 git 历史记录，故只能使用命令行

> 这应该是极少遇到的情况

```bash
git log -- [deleted-fileName]
```

然后就可以通过 gui 回滚对应文件

> 个人更倾向于使用 GUI 操作 git, 因为对我而言, GUI 更精准且易用。但是 GUI 只能适用于大多数场景，特殊场景只能用命令行解决。另外，我不惧怕深入一样东西, 前提是是否值得。

## Reference

- [How to Recover a Deleted File From a Git Repository](https://gitguys.com/repositories/how-to-recover-a-deleted-a-file-from-my-git-repository/)
- [git gui vs command line](https://codehangar.io/git-gui-vs-command-line/)
