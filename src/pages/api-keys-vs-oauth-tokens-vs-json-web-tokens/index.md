---
title: API keys vs OAuth vs Jwt
commentIdentifier: 'API keys vs OAuth vs Jwt'
date: '2019-11-26'
tags: ['http','web']
---

# API keys vs OAuth vs Jwt

## API Keys: 适用于开发者快速开发

早先在现代 API 中, 只有 API Keys。 API Keys 是所有实现中最简单的。你只要登录你的服务，找到 API Keys, 接下来就是超级管理员了。

## OAuth Tokens: 适用于获取用户数据

OAuth 不需要用户登录服务中获取当前的 API Keys, 用户只要使用现有的账号登录即可。例如使用 Google 账号登录 Postman, 使用微信授权登录等。当用户完成授权, 服务开发端将授权
信息保存在服务中, 供之后使用。

> 个人见解: OAuth 只适用于获取个人用户信息, 但是本身无法保存额外的信息, 故需要配合 jwt 使用。

## Jwt: 适用于权限的混合设置

[Jwt](https://jwt.io/?utm_source=zapier.com&utm_medium=referral&utm_campaign=zapier)能够保存任意的信息, 其行为和 cookie 类似。但是 cookie 是默认自动跟随的, 而 jwt 必须手动设置

# 在前端交互中, 通常 API key 存储在如下位置

- Authorization Header: `Authorization: Apikey 1234567890abcdef`
- Basic Auth
- Body Data
- Custom Header:
- Query String:

## Authorization Header && Basic Auth

放在请求头[`Authorization`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)中是较官方的设置, 大多数开源服务都是使用这种方式.缺点是兼容性较差，一些老旧的服务供应无法支持读取请求头
`Basic Auth`是`Authorization`的一种, 使用`Basic`算法进行加密, [更多可见](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes)

## Custom Header

自定义头适用于内部系统, 我当前公司就使用自定义头, 优势和`Authorization Header`一致

## Body Data

将 token 放入 Body 中不适用于`get`, `head`等请求, 所以通常需要和`Query String`方式结合使用。

## Query String

将 token 方式 query 中, 这是兼容性最好的一种方式, 但是这会暴露 token(连君子都能看见了)、url 特别长等问题

## Reference

- [API keys vs OAuth vs Jwt](https://medium.com/pixelpoint/best-practices-for-cache-control-settings-for-your-website-ff262b38c5a2)
