---
title: SSH登录不用密码
date: '2018-12-21'
tags: [linux]
original: 'http://www.linuxproblem.org/art_9.html'
---

目标:
我想要从电脑A(Alice)自动登录到某台linux服务器B(Bob), 不需要密码. 因为你需要在CI环境下运行脚本


```bash
alice@A:~> ssh Bob@B
# 你需要密码, 目标, 自动登录, 不需要这一步
Bob@B's password:
```

## 怎么做
首先需要登录电脑A， 生成一个ssh key, 注意不要输入`passphrase`
```bash
alice@A:~> ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/alice/.ssh/id_rsa):
Created directory '/home/alice/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/alice/.ssh/id_rsa.
Your public key has been saved in /home/alice/.ssh/id_rsa.pub.
The key fingerprint is:
3e:4f:05:79:3a:9f:96:7c:3b:ad:e9:58:37:bc:37:e4 alice@A
Now use ssh to create a directory ~/.ssh as user bob on B. (The directory may already exist, which is fine):
```

然后需要将上面生成的 `public key`添加到服务器B中

```bash
alice@A:~> cat .ssh/id_rsa.pub | ssh Bob@B 'cat >> .ssh/authorized_keys'
Bob@B's password:  #输入你的服务器密码, 登录
```

现在你就可以**不用密码**从A登录B

```bash
alice@A:~> ssh Bob@B
```


<!--Finally append a's new public key to b@B:.ssh/authorized_keys and enter b's password one last time:-->

<!--a@A:~> cat .ssh/id_rsa.pub | ssh b@B 'cat >> .ssh/authorized_keys'-->
<!--b@B's password:-->
<!--From now on you can log into B as b from A as a without password:-->

<!--a@A:~> ssh b@B-->
<!--A note from one of our readers: Depending on your version of SSH you might also have to do the following changes:-->

<!--Put the public key in .ssh/authorized_keys2-->
<!--Change the permissions of .ssh to 700-->
<!--Change the permissions of .ssh/authorized_keys2 to 640-->
