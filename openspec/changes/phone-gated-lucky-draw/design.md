## Context

- 站点是 Gatsby v4 + React 16 静态博客，部署为纯静态资源（`gh-pages`），没有自有后端。
- 已有 CloudBase 接入：`src/cloudbase/index.js` 通过 CDN 加载 `https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js`（实测当前为 **3.45.0**，同时保留 `app.auth()` / `app.database()` 旧式 API，也包含 `getVerification` / `signInWithOtp`），初始化环境 `mj-test-d7ggejqzf7df8ef02`（`ap-shanghai`），并**无条件匿名登录**。
- 已有数据访问范式见 `src/services/suone.js`：浏览器直连 `app.database().collection(...)`，`timestamp` 存毫秒数值；UI 用 styled-components，移动端优先（`@media (max-width: 768px)`），组件放 `src/components/<Name>/index.js`，页面放 `src/pages/<slug>/index.js`。
- `src/pages/bigplan-suone-luck-draw/index.js` 已存在但为空文件，即本次活动页的既定路由。
- 关键平台约束：CloudBase 的 `<button open-type="getPhoneNumber">` / `signInWithPhoneAuth` **仅小程序可用**，H5（含微信内置浏览器）能拿到"经校验手机号"的唯一 CloudBase 途径是**短信验证码登录**。这决定了下面的取号方案。
- 已确认的产品决策：所有环境均走短信验证码登录取号（后续决策变更，不再区分微信/非微信）；判定与写库放前端；白名单存 CloudBase 新集合；单一奖品 + 转盘动画；活动截止到 2026-09-30 23:59:59 GMT+8；奖品与文案先用占位符（后续由作者自行调整）；CDN SDK 版本保持 `latest` 不变。

## Goals / Non-Goals

**Goals:**
- 名单内手机号可参与，一人一次，中奖率 15%，结果落库可追溯。
- 手机号来自 CloudBase 短信验证，不可由用户随意伪造成任意号码。
- 复用现有 CloudBase 单例与 service/组件分层，不引入新的 npm 依赖。
- 概率与奖品名可通过单一常量调整，无需改动渲染逻辑。

**Non-Goals:**
- 不做防作弊加固（用户可在控制台/DevTools 绕过前端判定，已知并接受）。
- 不做后台管理界面：白名单通过 CloudBase 控制台 + 一个本地生成脚本维护。
- 不做多奖品/库存/领奖核销/中奖通知短信。
- 不改造 `suone-code` 既有功能，只在 CloudBase 单例上做向后兼容的登录态调整。

## Decisions

### D1. 取号方式：所有环境走 CloudBase 短信验证码登录
- **方案**：不论是否在微信内，均渲染「手机号 + 验证码」表单，调用旧式 API：
  1. `auth.getVerification({ phone_number: '+86 ' + phone })` → `{ verification_id, is_user }`
  2. `auth.verify({ verification_id, verification_code })` → `{ verification_token }`
  3. `is_user ? auth.signIn({ username: '+86 ' + phone, verification_token }) : auth.signUp({ phone_number: '+86 ' + phone, verification_code, verification_token })`
- 手机号取值：优先取登录返回用户对象上的手机号字段（`phone_number` / `phone`，取到即用），取不到则用刚刚通过验证的输入值——两者等价，因为该号码已通过短信校验。
- **备选与否决**：小程序 `getPhoneNumber`（H5 不可用）；公众号网页授权拿 openid 再映射手机号（需额外维护映射 + 配置 provider，用户已否决）；非微信手动输入（无法证明号码归属，后续决策改为全环境强制短信验证）。
- UA 判定（`micromessenger`）仍保留，但仅用于标记记录 `source`（`wechat-sms` / `sms`），不再分流取号方式。
- **实现注意**：`+86 ` 前缀带空格是旧式 SDK 的号码格式；实现时先在 dev 环境跑通一次真实短信，若 3.45.0 的旧式 auth 在该环境不可用，则改用同一 SDK 的 `auth.signInWithOtp({ phone }) → data.verifyOtp({ token })`，UI 与状态机不变。

### D2. 判定与写库放前端，用简单权限约束
- `lucky_draw_whitelist`：权限 **ADMINWRITE**（所有人可读、仅管理端可写）——前端只读校验，用户无法给自己加名额。
- `lucky_draw_record`：权限 **READONLY**（所有人可读、仅创建者与管理端可写）——跨用户按 `phoneKey` 查重需要公开读；用户只能写自己的文档。
- **备选与否决**：云函数判定（最安全，用户已否决）；`PRIVATE` 权限（无法跨用户查重，一人一次会失效）。

### D3. 手机号不落明文：`phoneKey` 哈希 + `phoneMasked` 脱敏
- `phoneKey = sha256Hex(SALT + phone).slice(0, 32)`，用浏览器内置 `crypto.subtle.digest('SHA-256', ...)`（无新依赖，`localhost` 与 https 均属安全上下文）。
- `phoneMasked = phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')`，仅用于展示与人工对账。
- 白名单与记录集合都以 `phoneKey` 为查询键，两个集合公开读时**不暴露完整号码**。
- **残余风险**：11 位号段空间约 10^9，salt 在前端包中可见，理论上可被穷举反查；彻底封闭需改云函数（见 Risks）。

### D4. 数据模型
`lucky_draw_whitelist`（控制台/脚本导入维护）
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `phoneKey` | string | 哈希键，查询用 |
| `phoneMasked` | string | 脱敏号码，人工识别用 |
| `enabled` | boolean | `false` 表示临时禁用；缺省视为启用 |
| `note` | string | 可选备注 |

`lucky_draw_record`（前端写入，一手机号一条）
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `phoneKey` | string | 与白名单对应 |
| `phoneMasked` | string | 脱敏号码 |
| `result` | `'win' \| 'lose'` | 判定结果 |
| `prize` | string | 中奖时为奖品名，未中奖为 `''` |
| `source` | `'wechat-sms' \| 'sms'` | 取号来源（均为短信验证，区分是否在微信内） |
| `timestamp` | number | `Date.now()` 毫秒，与既有 `phone_use_record` 保持一致 |

### D5. 抽奖流程与幂等策略
状态机（`src/components/LuckyDraw/index.js` 单一 `stage` 状态驱动）：

```
detecting ─┬─ 已截止 → expired ──(点击「查询我的抽奖结果」)──┐
           └─ 活动中 ───────────────────────────────────┤
                                                        ↓
                        phoneGate(sms) → verifying → gateChecking
                          ├─ 不在白名单 → blocked
                          ├─ 已有记录   → alreadyDrawn(回显历史 result)
                          ├─ 已截止且无记录 → expiredNoRecord
                          └─ 可抽奖     → ready → spinning → saving → result
                                                              └─ 写入失败 → saveFailed(可重试，沿用首次判定)
```
- 判定：`const win = Math.random() < WIN_RATE`（`WIN_RATE = 0.15`）。**先判定，再按结果决定转盘停在哪个扇区**，保证动画与结果一致。
- 幂等：进入 `ready` 前查一次 `count()`；写入前再查一次（多标签页并发兜底）；命中已有记录则放弃写入并回显。`spinning`/`saving` 期间按钮禁用，忽略重复点击。
- 判定结果先存 React state 再写库，写库失败重试不重新 `Math.random()`。

### D6. 活动截止时间
- 常量 `DRAW_DEADLINE = new Date('2026-09-30T23:59:59+08:00').getTime()`，与 `WIN_RATE` / `PRIZE_NAME` 同放 `src/services/luckyDraw.js`；`isExpired()` 返回 `Date.now() > DRAW_DEADLINE`。
- 截止后**不是**直接关页面：首屏进入 `expired` 态，展示「活动已结束」+「查询我的抽奖结果」入口；点击后复用同一套 `phoneGate` 取号流程，查到记录进 `alreadyDrawn` 回显，查不到进 `expiredNoRecord`，全程不判定、不写库。
- 活动期内页面底部展示截止日期文案（占位文案，与奖品文案一并后续调整）。
- 时间源用客户端 `Date.now()`：用户改本机时间即可绕过截止判断。与 D2 的整体权衡一致（前端方案已接受可绕过），不额外引入云函数取服务端时间。
- **备选与否决**：截止后完全不可访问（已参与用户无法回看结果）；用 `db.serverDate()` 取服务端时间（该 API 只能用于写入字段，读当前时间需云函数）。

### D7. 转盘实现（无新依赖）
- 8 个扇区，索引 0 为奖品、其余为「谢谢参与」，用 `conic-gradient` 画底盘 + 绝对定位文字，指针固定在顶部。
- 旋转用 `transform: rotate(Ndeg)` + `transition: transform 2.6s cubic-bezier(0.16, 1, 0.3, 1)`，目标角度 `360 * 5 + (360 - sectorCenterDeg)`；`transitionend`（或 2600ms 定时兜底）后切到 `saving`/`result`。
- 尺寸 `min(280px, 72vw)`，保证移动端不溢出。

### D8. CloudBase 单例：不覆盖真实登录态
`src/cloudbase/index.js` 改为：取 `app.auth({ persistence: 'local' })`，仅当没有登录态时才 `signInAnonymously({})`（`hasLoginState` 等探测调用整体 `try/catch`，异常时退回原有匿名登录行为），并额外导出 `getAuth()` 供抽奖 service 复用同一实例。签名 `getCloudbase()`/`useCloudbase()` 保持不变，`suone` 相关功能不受影响。

### D9. 文件划分
- `src/services/luckyDraw.js`：常量（`WIN_RATE = 0.15`、`PRIZE_NAME`、`DRAW_DEADLINE`、`SALT`、集合名）、`hashPhone`、`maskPhone`、`isValidPhone`、`isExpired`、`isInWhitelist`、`findRecord`、`saveRecord`、`sendSmsCode`、`loginWithSmsCode`、`getLoggedInPhone`。
- `src/components/LuckyDraw/index.js`：状态机（含 `expired` / `expiredNoRecord`）+ 卡片布局 + 加载/错误反馈（复用 `GetSuoneCode` 的 `Card` / `ErrorMessage` / `GlobalLoading` 视觉风格）。
- `src/components/LuckyDraw/PhoneGate.js`：短信验证表单（手机号 + 验证码 + 60s 倒计时），保留 `manual` 形态代码但不再使用。
- `src/components/LuckyDraw/Wheel.js`：转盘展示与旋转动画。
- `src/pages/bigplan-suone-luck-draw/index.js`：`Helmet` + `graphql` 取 `siteMetadata.title/description`（对齐 `src/pages/suone-code/index.js`），渲染 `<LuckyDraw />`。
- `scripts/generate-lucky-draw-whitelist.js`：Node 脚本，输入手机号列表输出可导入控制台的 JSON（`phoneKey`/`phoneMasked`/`enabled`），脚本内 `SALT` 常量必须与 service 中一致（脚本顶部注释标明）。

## Risks / Trade-offs

- **前端判定可被绕过**（改概率、伪造记录、直接写库）→ 接受；影响面限定为一次小型活动，`lucky_draw_whitelist` 用 ADMINWRITE 防止扩名单，事后可用 `lucky_draw_record` 的 `timestamp` 与白名单核对异常数据；若后续需要严格保证，把 `isInWhitelist`/`saveRecord` 平移到云函数即可，UI 不变。
- **白名单/记录公开读**（手机号哈希可被 10^9 空间穷举）→ 只存哈希与脱敏号，不存明文；集合名不出现在公开文案中；真正敏感场景改云函数。
- **短信被恶意刷取产生费用** → 60 秒倒计时 + 发送期间禁用按钮 + 单页面内节流；上线前在控制台确认短信配额并留意用量。
- **CDN `latest` 版本漂移**（今天是 3.45.0，旧式 auth 可能在未来版本移除）→ 已决定本次**不** pin 版本（避免连带验证 `suone-code`）；缓解手段是实现时先在 dev 验证真实短信链路，并在 `loginWithSmsCode` 里对旧式 API 缺失的情况抛出可识别的错误信息，日后报错能快速定位到 SDK 变更。
- **短信登录未开启 / 需要 publishable key** → 上线前先在控制台开启「短信验证码登录」；若 3.45.0 在该环境要求 `accessKey`，按项目既有做法通过 `.env.*` + `gatsby-config.js` 的 `siteMetadata` 注入（参考 `D1_ACCESS_TOKEN`）。
- **客户端时间可被修改绕过截止时间** → 接受，与前端判定的整体权衡一致；事后可用 `lucky_draw_record.timestamp` 比对截止时间找出异常记录。
- **构建期无 `window`** → 环境判定、CloudBase 调用全部放 `useEffect`，首屏渲染占位加载态。
- **权限规则生效延迟** → CloudBase 规则缓存 2–5 分钟，改权限后首次写入可能被拒；联调时先等待再重试，写入需检查返回值而非只看 promise resolve。

## Migration Plan

1. CloudBase 控制台：创建 `lucky_draw_whitelist`（ADMINWRITE）与 `lucky_draw_record`（READONLY）；开启短信验证码登录。
2. 本地跑 `scripts/generate-lucky-draw-whitelist.js` 生成 JSON，导入白名单集合。
3. `npm run dev` 验证四条主链路：微信内短信取号（真机）、非微信浏览器短信取号、非白名单拦截、重复抽奖回显。
4. `npm run build` 确认无 SSR 报错，`npm run deploy` 发布。
5. 回滚：`git revert` 该次提交（页面文件恢复为空即路由不再产出内容），CloudBase 集合可保留数据不删除。

## Open Questions

无阻塞项。三个原有待定项已确认：

- 奖品名称与所有活动文案：实现时统一留占位符（`PRIZE_NAME = '待定奖品'`、领奖说明/截止日期文案用占位内容），后续由作者自行调整，本次变更不追求终稿文案。
- 活动截止时间：定为 2026-09-30 23:59:59 GMT+8，行为见 D6。
- CDN SDK 版本：保持 `latest` 不变，不做 pin。
