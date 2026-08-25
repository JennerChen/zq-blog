## ADDED Requirements

### Requirement: 客户端环境判定
系统 SHALL 根据 `navigator.userAgent` 判断当前是否运行在微信内置浏览器中（UA 包含 `micromessenger`，大小写不敏感）。该判定仅用于记录抽奖记录的 `source` 字段（`wechat-sms` / `sms`），不影响手机号获取方式——所有环境均统一走短信验证码登录。

#### Scenario: 微信内置浏览器
- **WHEN** 用户在微信内打开抽奖页，UA 中包含 `micromessenger`
- **THEN** 系统展示 CloudBase 短信验证码登录表单（手机号 + 验证码），抽奖记录 `source` 记为 `wechat-sms`

#### Scenario: 非微信客户端
- **WHEN** 用户在 Safari、Chrome 等非微信浏览器打开抽奖页
- **THEN** 系统同样展示 CloudBase 短信验证码登录表单，抽奖记录 `source` 记为 `sms`

#### Scenario: 服务端渲染阶段
- **WHEN** Gatsby 在构建期（`typeof window === 'undefined'`）渲染该页面
- **THEN** 系统 MUST NOT 访问 `navigator`、`localStorage` 或 CloudBase SDK，并渲染占位加载态，待浏览器挂载后再判定环境

### Requirement: 通过 CloudBase 短信验证码获取手机号
在所有客户端环境中，系统 SHALL 通过 CloudBase Web SDK 的短信验证码登录流程获取经运营商校验的手机号，并以登录态中的手机号作为抽奖身份，不接受用户自行修改后的手机号。

#### Scenario: 发送验证码成功
- **WHEN** 用户输入合法的 11 位手机号并点击「获取验证码」
- **THEN** 系统调用 CloudBase `auth().getVerification({ phone_number })` 发送短信，按钮进入 60 秒倒计时禁用状态

#### Scenario: 验证码校验通过并完成登录
- **WHEN** 用户输入收到的验证码并提交
- **THEN** 系统调用 `auth().verify()` 获取 `verification_token`，再根据 `is_user` 标记调用 `signIn()`（已注册）或 `signUp()`（未注册）完成登录
- **AND** 系统将登录态中的手机号作为后续抽奖使用的手机号

#### Scenario: 验证码错误或过期
- **WHEN** CloudBase 返回验证失败错误
- **THEN** 系统展示「验证码错误或已过期，请重新获取」，保留手机号输入内容，允许用户重新获取验证码

#### Scenario: 短信通道不可用
- **WHEN** `getVerification` 调用抛出错误（未开启短信登录、配额耗尽或网络失败）
- **THEN** 系统展示明确的错误提示与重试按钮，且 MUST NOT 回退到未验证直接提交手机号的方式

#### Scenario: 已存在有效登录态
- **WHEN** 用户已通过短信验证码登录且会话仍有效，再次打开抽奖页
- **THEN** 系统直接复用登录态中的手机号，跳过短信验证步骤

### Requirement: 手机号输入约束
系统 SHALL 在手机号输入前完成格式校验，并约束输入框行为。

#### Scenario: 手机号格式合法
- **WHEN** 用户输入符合 `/^1[3-9]\d{9}$/` 的手机号并请求发送验证码
- **THEN** 系统接受该手机号并发起短信验证码请求

#### Scenario: 手机号格式非法
- **WHEN** 用户输入的内容不满足 11 位中国大陆手机号格式
- **THEN** 系统展示「请输入正确的 11 位手机号」，阻止提交，且 MUST NOT 发起任何 CloudBase 请求

#### Scenario: 输入框输入约束
- **WHEN** 用户在手机号输入框中输入
- **THEN** 输入框 SHALL 使用数字键盘（`type="tel"`）、限制最大长度为 11 位，并自动过滤非数字字符

### Requirement: 退出短信登录态
系统 SHALL 在用户已通过短信验证后提供退出登录入口，允许用户切换手机号重新验证。

#### Scenario: 退出登录
- **WHEN** 用户在通过短信验证后的任意阶段点击「退出短信登录(切换手机号)」
- **THEN** 系统调用 CloudBase `auth().signOut()`，随后回退匿名登录态，清空当前手机号与抽奖上下文并回到短信验证表单

#### Scenario: 抽奖进行中禁止退出
- **WHEN** 转盘动画进行中或结果保存进行中
- **THEN** 退出按钮 MUST 处于禁用状态

### Requirement: 手机号展示脱敏
系统 SHALL 在界面上展示手机号时使用脱敏格式，隐藏中间 4 位（如 `138****8000`）。

#### Scenario: 结果页展示参与手机号
- **WHEN** 抽奖结果或「已参与过」提示中需要展示手机号
- **THEN** 系统展示脱敏后的手机号，MUST NOT 展示完整号码
