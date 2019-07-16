---
title: nginx 自定义 header
date: '2019-07-16'
tags: ['nginx']
---

最近在做一个内部工具项目时，需要前端根据情况请求不同接口地址, 但是后端接口不支持跨域访问，故只能通过 nginx 代理

## nginx 配置

```nginx
server {
    listen 8080;
    server_name  localhost;

    underscores_in_headers on;

    location ~ ^\/(monitorapi|monitor-login)\/* {
        proxy_pass $http_monitor_proxy_api;
    }
}

```

> `underscores_in_headers on;`必须启用， nginx 会读取自定义 header

monitor_proxy_api 在 ajax 请求中, 只要携带请求头 monitor_proxy_api 即可将其值代理

## Reference

- [nginx-passing-back-custom-header](https://serverfault.com/questions/297225/nginx-passing-back-custom-header/297939)
