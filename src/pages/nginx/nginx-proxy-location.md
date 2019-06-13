---
title: 常见 nginx proxy location 配置笔记
date: '2019-06-13'
tags: ['nginx']
---

nginx 是前端常用的服务器, 配置 location 是一项必须掌握的技能。如下是我整理的一些常用 location 常用配置

## 单页面配置

```nginx
location / {
    root /path/to/public
    try_files $uri $uri/ /index.html;
}
```

## proxy location

nginx location 共有 `[ = | ~ | ~* | ^~ ]` 可选前缀方式。

假如有如下配置

```nginx
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /documents/ {
    [ configuration C ]
}

location ^~ /images/ {
    [ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

- 如果没有任何 prefix, 当所有其他路由都不满足时，会执行配置`B`
- `=`会使用严格模式,只有当请求为"/"时才访问`A`。并且其优先级最高
- `~*`，`~`的区别为:`~*`是大小写不敏感(case-insensitive), `~`大小写敏感(case-sensitive), 由于一般服务都部署在 linux 上, 故推荐使用`~`
- `^~`: 会提升优先级, 首先匹配路由, 优先级会仅次于`=`。一经匹配, 遍不会使用其他路由。

## 常用代理正则

### 匹配后缀 `gif，jpg, jpeg`

```nginx
location ~* \.(gif|jpg|jpeg)$ {

}
```

### 匹配以 user,product 开头的所有请求

```nginx
location ~* ^\/(user|product)\/ {

}
```

## Reference

- [regex 在线正则工具](https://regex101.com/)
- [nginx location 官方文档](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)
