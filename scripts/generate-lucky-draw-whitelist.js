#!/usr/bin/env node

/**
 * 生成可导入 CloudBase lucky_draw_whitelist 集合的白名单数据
 *
 * 用法:
 *   node scripts/generate-lucky-draw-whitelist.js 13800138000 13900139000
 *   node scripts/generate-lucky-draw-whitelist.js phones.txt > whitelist.jsonl
 *
 * 支持两种输入方式:
 *   1. 命令行参数直接传入若干手机号
 *   2. 传入一个文本文件路径, 文件内每行一个手机号(自动忽略空行与多余字符)
 *
 * 输出为 JSON Lines(每行一个文档), 即 CloudBase 控制台"导入"功能支持的 JSON 格式。
 *
 * 注意: 下面的 SALT 必须与 src/services/luckyDraw.js 中的 SALT 完全一致,
 * 否则前端算出的 phoneKey 与导入的数据对不上, 白名单会全部校验失败。
 */

const crypto = require('crypto')
const fs = require('fs')

const SALT = 'zqblog-lucky-draw-2026'

const isValidPhone = phone => /^1[3-9]\d{9}$/.test(phone || '')

const hashPhone = phone =>
  crypto
    .createHash('sha256')
    .update(`${SALT}${phone}`)
    .digest('hex')
    .slice(0, 32)

const maskPhone = phone => phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(
    '请传入手机号或名单文件, 例如:\n  node scripts/generate-lucky-draw-whitelist.js 13800138000 13900139000\n  node scripts/generate-lucky-draw-whitelist.js phones.txt > whitelist.jsonl'
  )
  process.exit(1)
}

// 单个参数且是已存在的文件时, 按名单文件读取(每行一个号码, 兼容逗号/空格分隔)
const isFileArg = args.length === 1 && fs.existsSync(args[0])

const phones = isFileArg
  ? fs
      .readFileSync(args[0], 'utf8')
      .split(/[\s,;，；]+/)
      .map(item => (item.match(/1\d{10}/) || [''])[0])
      .filter(Boolean)
  : args

const invalidPhones = phones.filter(phone => !isValidPhone(phone))

if (invalidPhones.length > 0) {
  console.error(`以下手机号格式不合法: ${invalidPhones.join(', ')}`)
  process.exit(1)
}

const uniquePhones = [...new Set(phones)]

uniquePhones.forEach(phone => {
  console.log(
    JSON.stringify({
      phoneKey: hashPhone(phone),
      phoneMasked: maskPhone(phone),
      enabled: true,
      note: '',
    })
  )
})
