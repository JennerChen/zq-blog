## Why

博客需要一个面向特定人群（如金地广场业主/内部同事）的轻量抽奖活动页，只有名单内的手机号可以参与，用来做一次性的福利发放。当前站点已有 CloudBase 接入（匿名登录 + 数据库读写）与 `src/pages/bigplan-suone-luck-draw/` 空页面占位，缺的是抽奖资格判定、手机号获取与抽奖记录三块能力。

## What Changes

- 新增抽奖活动页 `src/pages/bigplan-suone-luck-draw/index.js`（目前为空文件），承载完整抽奖流程。
- 新增手机号获取能力：所有客户端环境均走 CloudBase 短信验证码登录（`getVerification` + `verify` + `signIn`）拿到经校验的手机号；UA 判定仅用于标记记录来源（`wechat-sms` / `sms`）。
- 新增白名单校验：手机号必须存在于 CloudBase 集合 `lucky_draw_whitelist` 且 `enabled !== false`，否则不允许抽奖。
- 新增抽奖判定：中奖概率 15%，判定与写库在前端完成（沿用项目现有 `src/services/suone.js` 的纯前端 CloudBase 调用风格）。
- 新增单次限制：同一手机号在 CloudBase 集合 `lucky_draw_record` 中已有记录时，不再重复抽奖，直接回显历史结果。
- 新增活动截止时间 2026-09-30 23:59:59 GMT+8：截止后不再接受新抽奖，但已参与用户仍可取号查询自己的历史结果。
- 新增转盘动画与结果展示：单一固定奖品，中奖显示奖品名，未中奖显示安慰文案；奖品名与各类文案先用占位符，后续由作者自行调整。
- 修改 `src/cloudbase/index.js`：仅在没有登录态时才匿名登录，避免覆盖短信验证码登录得到的真实会话。

## Capabilities

### New Capabilities
- `lucky-draw`: 抽奖资格校验（白名单）、活动截止时间、15% 概率判定、每手机号一次的幂等限制、抽奖记录存储与结果展示（含转盘动画）。
- `phone-identity`: 所有客户端环境统一通过 CloudBase 短信验证码登录取号，并对手机号输入做格式校验。

### Modified Capabilities
<!-- openspec/specs/ 当前为空，没有既有 capability 的需求发生变更 -->

## Impact

- 新增文件：`src/pages/bigplan-suone-luck-draw/index.js`（填充空文件）、`src/components/LuckyDraw/*`（页面组件、手机号获取组件、转盘组件）、`src/services/luckyDraw.js`。
- 修改文件：`src/cloudbase/index.js`（登录态复用）。
- CloudBase 环境 `mj-test-d7ggejqzf7df8ef02` 需新增两个集合 `lucky_draw_whitelist`、`lucky_draw_record` 并配置权限；需在控制台开启「短信验证码登录」并确认短信配额。
- 安全权衡：判定逻辑在前端，具备技术能力的用户可绕过概率与次数限制；白名单集合需公开读，手机号以脱敏/哈希方式存储以降低泄露面（详见 design.md）。
- 无新增 npm 依赖，继续使用 CDN 版 `cloudbase.full.js`（版本保持 `latest` 不变）与 styled-components。
