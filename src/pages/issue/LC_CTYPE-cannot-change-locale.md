---
title: 'LC_CTYPE: cannot change locale (UTF-8): No such file or directory'
date: '2018-12-31'
tags: ['linux']
original: 'https://gist.github.com/mes01/c8634bd4f94f21e4f4259e257509d68f'
---

centos阿里云服务器登录警告 LC_CTYPE: cannot change locale (UTF-8): No such file or directory

![LC_CTYPE: cannot change locale (UTF-8): No such file or directory](./lc_ctype_login_warn.png)

如何解决:
在文件
```bash
vi /etc/environment
```
添加这2行
```
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
```
重新登录服务器即可
