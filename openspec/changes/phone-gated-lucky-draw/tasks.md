## 1. CloudBase 环境准备

- [ ] 1.1 在环境 `mj-test-d7ggejqzf7df8ef02` 创建集合 `lucky_draw_whitelist`，权限设为 ADMINWRITE（所有人可读、仅管理端可写）
- [ ] 1.2 创建集合 `lucky_draw_record`，权限设为 READONLY（所有人可读、仅创建者与管理端可写）
- [ ] 1.3 在控制台开启「短信验证码登录」，确认短信配额可用；若该环境要求 publishable key，按 `.env.*` + `gatsby-config.js` 的 `siteMetadata` 方式注入 `accessKey`
- [ ] 1.4 用真实手机号在 dev 环境跑通一次短信取号，确认 3.45.0 SDK 上 `auth().getVerification/verify/signIn` 可用；若不可用则改用 `auth.signInWithOtp` + `data.verifyOtp`，并在 design.md 的 D1 记录实际采用的 API

## 2. 数据与工具层

- [x] 2.1 新建 `src/services/luckyDraw.js`，定义常量：`WIN_RATE = 0.15`、`PRIZE_NAME`（占位 `待定奖品`）、`DRAW_DEADLINE = new Date('2026-09-30T23:59:59+08:00').getTime()`、`SALT`、集合名 `lucky_draw_whitelist` / `lucky_draw_record`
- [x] 2.2 实现 `isValidPhone`（`/^1[3-9]\d{9}$/`）、`maskPhone`（`138****8000`）、`hashPhone`（`crypto.subtle` SHA-256，取前 32 位十六进制）、`isExpired`（`Date.now() > DRAW_DEADLINE`）
- [x] 2.3 实现 `isInWhitelist(phone)`：按 `phoneKey` 查询白名单，命中且 `enabled !== false` 才返回 true；查询异常向上抛出，不默认放行
- [x] 2.4 实现 `findRecord(phone)`（按 `phoneKey` 取已有记录，无则返回 null）与 `saveRecord({ phone, result, prize, source })`（写入 `phoneKey`/`phoneMasked`/`result`/`prize`/`source`/`timestamp`，检查返回值判定成功）
- [x] 2.5 实现 `sendSmsCode(phone)`、`loginWithSmsCode({ phone, code, verificationId, isUser })`、`getLoggedInPhone()`，全部复用 CloudBase 单例
- [x] 2.6 新建 `scripts/generate-lucky-draw-whitelist.js`：接收手机号参数，输出可导入控制台的 JSON 数组（`phoneKey`/`phoneMasked`/`enabled: true`），脚本内 `SALT` 与 service 保持一致并加注释说明

## 3. CloudBase 单例调整

- [x] 3.1 修改 `src/cloudbase/index.js`：`app.auth({ persistence: 'local' })`，仅在无登录态时匿名登录，探测逻辑用 `try/catch` 兜底回退到原有匿名登录行为
- [x] 3.2 导出 `getAuth()` 供抽奖 service 使用，保持 `getCloudbase()` / `useCloudbase()` 的现有签名与行为
- [ ] 3.3 回归验证 `/suone-code` 页面：余额查询、手机号列表、查询验证码功能均正常

## 4. UI 组件

- [x] 4.1 新建 `src/components/LuckyDraw/Wheel.js`：8 扇区 `conic-gradient` 转盘 + 顶部指针，支持传入目标扇区并以 2.6s 过渡旋转，`transitionend` 与 2600ms 定时双重回调，尺寸 `min(280px, 72vw)`
- [x] 4.2 新建 `src/components/LuckyDraw/PhoneGate.js`：微信形态（手机号 + 验证码 + 60s 倒计时按钮）与手动形态（`type="tel"`、`maxLength=11`、过滤非数字）两种渲染，含格式校验错误提示
- [x] 4.3 新建 `src/components/LuckyDraw/index.js`：实现 `detecting → expired/phoneGate → verifying → gateChecking → ready/blocked/alreadyDrawn/expiredNoRecord → spinning → saving → result/saveFailed` 状态机，复用 `GetSuoneCode` 的 Card / ErrorMessage / GlobalLoading 视觉风格
- [x] 4.4 在组件内实现环境判定：`useEffect` 中读 UA 判断 `micromessenger`，SSR 阶段只渲染占位加载态，不触碰 `navigator` / `localStorage` / SDK
- [x] 4.5 实现截止时间分支：首屏 `isExpired()` 为真时进 `expired` 态（「活动已结束」+「查询我的抽奖结果」入口，抽奖按钮不可用），取号后无记录进 `expiredNoRecord`、有记录进 `alreadyDrawn`；截止后全程不判定不写库；活动期内页面展示截止日期占位文案
- [x] 4.6 实现抽奖判定与幂等：先 `Math.random() < WIN_RATE` 得结果 → 转盘转到对应扇区 → 写入前二次查重 → 命中已有记录则回显；`spinning`/`saving` 期间禁用按钮
- [x] 4.7 实现结果区域：中奖显示「恭喜中奖」+ 奖品名 + 领奖说明（占位文案）；未中奖显示安慰文案；`alreadyDrawn` 展示历史结果 + 「您已参与过本次抽奖」+ 脱敏手机号
- [x] 4.8 实现错误与重试反馈：短信通道不可用（不回退手动输入）、验证码错误、白名单查询失败、写入失败（重试不重新判定）各自的文案与按钮
- [x] 4.9 移动端适配核对：≤768px 卡片满宽无边框、按钮 `min-height: 48px`、转盘不溢出

## 5. 页面接入

- [x] 5.1 填充 `src/pages/bigplan-suone-luck-draw/index.js`：参照 `src/pages/suone-code/index.js` 用 `Helmet` + `graphql` 取 `siteMetadata.title/description`，渲染 `<LuckyDraw />`
- [ ] 5.2 `npm run dev` 打开 `/bigplan-suone-luck-draw/` 确认页面可访问、无控制台报错

## 6. 验收与发布

- [ ] 6.1 用脚本生成 2–3 个测试手机号的白名单条目并导入集合
- [ ] 6.2 非微信浏览器验收：短信取号 → 白名单号码可抽奖并落库（`source` 记为 `sms`）、非白名单号码被拦截且无记录写入、格式非法时不发请求
- [ ] 6.3 重复抽奖验收：同一手机号二次进入直接回显首次结果、按钮禁用、`lucky_draw_record` 中仍只有一条记录
- [ ] 6.4 微信真机验收：短信取号 → 白名单校验 → 抽奖 → 落库全链路，`source` 记为 `wechat-sms`
- [ ] 6.5 概率抽样验证：临时把 `WIN_RATE` 调到 1 与 0 各验证一次中奖/未中奖分支后改回 0.15
- [ ] 6.6 截止时间验收：临时把 `DRAW_DEADLINE` 改为过去时间，验证首屏 `expired` 文案与入口、已参与手机号可回显历史结果、未参与手机号提示活动已结束且无新记录写入，验证后恢复为 2026-09-30 23:59:59 GMT+8
- [ ] 6.7 `npm run build` 通过（无 SSR / `window` 相关报错），按需执行 `npm run deploy`
- [ ] 6.8 确认所有占位文案（`PRIZE_NAME`、领奖说明、截止日期文案、安慰文案）集中且易于替换，并在代码里标注待调整
- [x] 6.9 上线前清空 `src/services/luckyDraw.js` 中的 `TEST_PHONES`（联调用的测试白名单，不清空则该号码无需入名单即可抽奖）
