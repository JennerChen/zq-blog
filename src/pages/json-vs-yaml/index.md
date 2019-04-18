---
title: 'JSON vs YAML'
date: '2019-04-18'
tags: [json, yaml, DevOps]
---

最近一直在折腾构建, 遇到很多 yaml 配置文件。但是我对 yaml 不是很熟悉, 经过一些简单学习有了一些初步的个人见解, 如有不对, 请指正

## YAML

YAML 在配置文件广泛的使用, 其主要优势

- 允许注释: yaml 相较于 json 最大的优势
- self reference: 使用[anchors](https://yaml.org/spec/1.2/spec.html#id2785586)实现
- 没有一堆无意思的标识符, 例如 `{}`, `"`, `,`

## JSON

JSON 格式在前端非常普遍, 它属于 YAML 的一个子集

- serialization: 可序列化(这对 API 的传输很重要)
- 更简单的规则,且写法固定

## 个人观点

YAML 语法相对于 JSON 过于灵活, 这和 XML 语法相对于 JSON 过于繁琐, JSON 正好在其中间,获得一种最好的平衡

JSON 最大的缺点是无法使用评论, 一种解决办法就是使用 \_comment 实现。
另外一种办法, 前端已经广泛使用了, 那就是直接使用 js, 例如 webpack.config.js。

个人更倾向于<b>JSON OVER YAML</b>, 将来会有越来越多的工具支持 JSON 配置。因为前端更熟悉 JSON, 并且现阶段大量说明会另外使用文档来实现,不需要再 YAML 中设置。

但是, 现阶段很多工具依然使用 YAML, 还是得学习其语法 😭

## Reference

- [JSON to YAML](https://www.json2yaml.com/yaml-vs-json)
- [Ansible](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html): 一个学习 yaml 语法的网站
