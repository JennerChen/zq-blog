---
title: HTTP HEADER 之 ORIGIN 深入理解
date: '2019-10-15'
tags: [http, fetch]
---

## 背景

最近在做一个服务集成的项目，需要将一个第三方的日志服务系统直接接入我们现有的日志系统中，第三方服务支持[Bearer](https://tools.ietf.org/html/rfc6750)授权访问，故
最后解决方案是前端直接调用第三方服务获取数据。但是遇到了鉴权的问题, 最后获知是`Origin`导致的

## Origin 的来源和作用

经查询资料, [Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Origin)是[Referer](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referer)头的升级版, 常用于[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)或者非`GET`、`HEAD`请求([MDN 的说法有误，不是只有 `POST`](https://fetch.spec.whatwg.org/#origin-header))相关的服务端身份检验

> 个人觉得，这个 Origin 头绝大部分都用于 CORS

## FAQ

> 浏览器端`Origin`无法手动设置

- `Origin`头是浏览器保护字段，类似的有 `Referer`、`Host`、`Content-Length`、`Keep-alive`等，但是可以通过 nginx 代理修改。浏览器根据约定自动附加

> 浏览器附加`Origin`头的规则

- 根据[fetch](https://fetch.spec.whatwg.org)说明, 只有当请求为跨域请求或者非`get`,`head`请求时都会自动附加。不可被编程，不可被编辑。`get`,`head`请求由于兼容性，故无法实现

> 非 CORS 情况下, `Origin`字段框架使用情况

- 据我了解, 绝大部分框架都没有使用 Origin 字段, 我所待的几个公司也从未根据此值来判断

> 所有符合规则的资源都会包含 Origin 头?

- 不是。例如跨域图片不会包含 Origin 头, 更多资源请[查看](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null)

## Hack CORS

浏览器执行 CORS(跨域请求)时都会发送一个`options`请求，获取服务端是否允许跨域的参数。这是为了安全性考虑的。有些情况我们无法控制服务端的行为，故只能想办法绕过验证。

- 本地开发: 使用[node-http-proxy](https://github.com/http-party/node-http-proxy)代理服务请求

- 生产/本地开发: 使用 nginx 代理服务, 例如

```nginx
location ~ ^\/(scholar_complete)\/* {
    proxy_pass https://scholar.google.com/;
}
```

这会将所有`/scholar_complete`开头的请求转发到 Google Scholar(谷歌学术)。

- [jsonp](https://www.w3schools.com/js/js_json_jsonp.asp)是一种较老的方式, 现在基本不考虑了。

## Reference

- [Bearer](https://tools.ietf.org/html/rfc6750)
- [CROS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [MDN ORIGIN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Origin)
- [origin-header](https://fetch.spec.whatwg.org/#origin-header)
- [When do browsers send the Origin header? When do browsers set the origin to null?](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null)
