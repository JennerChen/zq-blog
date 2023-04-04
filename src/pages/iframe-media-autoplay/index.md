---
title: iframe media 自动播放
date: '2023-04-03'
tags: [js]
---

## 前言

近期在项目中集成软电话插件，遇到不少小问题， 其中iframe播放问题花了较多时间， 此处整理下

## media 自动播放

简单来说， 是浏览器限制自动播放。下面是官话

```
Chrome's autoplay policies are simple:
1 、Muted autoplay is always allowed.  静音的能自动播放
2、 Autoplay with sound is allowed if: 带声音自动播放(以下满足其一即可)
    *   User has interacted with the domain (click, tap, etc.).要有交互动作
    *   On desktop, the user's [Media Engagement Index] threshold has been crossed, meaning the user has previously played video with sound. (类似于有各种条件算积分,积分够了就能自动播放,chrome://media-engagement/ 这个可以看分数)
3、The user has [added the site to their home screen]) on mobile or [installed the PWA] on desktop. 用户在移动端添加到主屏幕或者在桌面安装了PWA应用
4、Top frames can [delegate autoplay permission] to their iframes to allow autoplay with sound.(顶级frame可以授权给iframe加载的内容)
```

解决方法:

1) iframe设置`allow="autoplay"`标， 这种方式适合能操作容器页面的情况， 使用时会有权限提示， 需要用户手动允许

2) 保证iframe同源，即容器域名和iframe域名一致。 


## Reference

- [Chrome autoplay](https://developer.chrome.com/blog/autoplay/#new-behaviors)
