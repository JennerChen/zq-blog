---
title: SSH登录不用密码之使用私钥登陆
date: '2019-12-19'
tags: [linux, ssh]
---

# 背景

在现代持续构建系统中, 都是使用私钥登陆。最近在使用这种方式登录时, 遇到无法登录的情况。最后了解原因是自己对 ssh 理解不够所致。

## 重现方式

[这这篇外网的资料中有完整的教程， 如何使用私钥登陆](https://support.rackspace.com/how-to/logging-in-with-an-ssh-private-key-on-linuxmac/),如何您在一台全新机器中使用
`ssh-keygen`生成 ssh 私钥, 然后按照上述教程操作，你会发现无法登陆服务器。

## troubleshot

起初, 我认为 ssh 使用私钥登陆 linux 时, 只要与服务器的 .ssh/id_rsa 的私钥一致即可访问服务器。但是实际情况是无法登录。这是因为服务端只会读取`authorized_keys`文件中的密钥, 与之匹配才能登陆,
所以, 需要将 当前 .ssh/id_rsa.pub 中的内容加入`authorized_keys`文件中。这样才能继续登陆。
