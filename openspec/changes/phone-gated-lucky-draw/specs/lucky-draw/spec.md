## ADDED Requirements

### Requirement: 白名单资格校验
系统 SHALL 仅允许存在于 CloudBase 集合 `lucky_draw_whitelist` 中且未被禁用的手机号参与抽奖。校验以手机号的哈希值 `phoneKey` 作为查询条件。

#### Scenario: 手机号在白名单内
- **WHEN** 用户提交的手机号对应的 `phoneKey` 在 `lucky_draw_whitelist` 中存在且文档的 `enabled !== false`
- **THEN** 系统允许该用户进入抽奖环节，展示可点击的抽奖按钮

#### Scenario: 手机号不在白名单内
- **WHEN** 用户提交的手机号对应的 `phoneKey` 在 `lucky_draw_whitelist` 中不存在
- **THEN** 系统展示「该手机号不在本次活动名单内」，并 MUST NOT 写入任何抽奖记录

#### Scenario: 白名单条目被禁用
- **WHEN** 命中的白名单文档中 `enabled === false`
- **THEN** 系统按不在名单内处理，拒绝抽奖

#### Scenario: 白名单查询失败
- **WHEN** 白名单查询请求抛出错误或超时
- **THEN** 系统展示「网络异常，请稍后重试」与重试按钮，且 MUST NOT 默认放行该手机号

### Requirement: 活动截止时间
系统 SHALL 在活动截止时间（2026-09-30 23:59:59 GMT+8）之后停止接受新的抽奖，但仍允许已参与用户查询自己的历史结果。截止时间 SHALL 由单一常量配置。

#### Scenario: 活动进行中
- **WHEN** 当前时间早于截止时间
- **THEN** 系统正常执行取号、白名单校验与抽奖流程
- **AND** 页面展示活动截止日期文案

#### Scenario: 活动已结束且用户未参与过
- **WHEN** 当前时间晚于截止时间，且该手机号在 `lucky_draw_record` 中没有记录
- **THEN** 系统展示「活动已结束」提示，MUST NOT 执行概率判定或写入记录

#### Scenario: 活动已结束但用户已参与过
- **WHEN** 当前时间晚于截止时间，且该手机号在 `lucky_draw_record` 中已有记录
- **THEN** 系统展示该手机号的历史抽奖结果

#### Scenario: 活动已结束时的首屏
- **WHEN** 用户在截止时间之后打开抽奖页
- **THEN** 页面首屏展示「活动已结束」状态与「查询我的抽奖结果」入口，抽奖按钮 MUST NOT 可用

### Requirement: 每手机号仅可抽奖一次
系统 SHALL 保证同一手机号在整个活动期间只产生一条抽奖记录，重复进入时回显首次抽奖结果而不重新判定。

#### Scenario: 首次抽奖
- **WHEN** 通过白名单校验的手机号在 `lucky_draw_record` 中没有记录，用户点击抽奖
- **THEN** 系统执行概率判定，写入一条抽奖记录，并展示本次结果

#### Scenario: 已抽奖过的手机号再次进入
- **WHEN** 手机号在 `lucky_draw_record` 中已存在记录
- **THEN** 系统跳过抽奖动画与概率判定，直接展示历史结果与「您已参与过本次抽奖」提示，抽奖按钮保持禁用

#### Scenario: 抽奖过程中重复点击
- **WHEN** 用户在一次抽奖请求处理中（转盘旋转、写库未完成）再次点击抽奖按钮
- **THEN** 系统忽略重复点击，按钮处于禁用态，MUST NOT 产生第二次判定或第二条记录

#### Scenario: 写入记录时发现已存在记录
- **WHEN** 写入前的二次查重发现该手机号已有记录（例如多标签页并发）
- **THEN** 系统放弃本次写入，改为展示已存在的那条记录的结果

### Requirement: 中奖概率判定
系统 SHALL 以 15% 的概率判定用户中奖，判定结果与展示结果、存储结果三者必须一致。

#### Scenario: 判定为中奖
- **WHEN** 抽奖判定的随机值落入中奖区间（概率 15%）
- **THEN** 系统将结果标记为 `win`，记录奖品名称，并向用户展示中奖信息

#### Scenario: 判定为未中奖
- **WHEN** 随机值落在中奖区间之外（概率 85%）
- **THEN** 系统将结果标记为 `lose` 并展示未中奖文案

#### Scenario: 概率参数集中配置
- **WHEN** 需要调整中奖概率或奖品名称
- **THEN** 修改点 SHALL 集中在一个配置常量中（概率、奖品名各一个常量），无需改动组件渲染逻辑

### Requirement: 抽奖记录持久化
系统 SHALL 将每次抽奖结果写入 CloudBase 集合 `lucky_draw_record`，字段包含 `phoneKey`、脱敏手机号 `phoneMasked`、结果 `result`、奖品 `prize`、来源 `source` 与时间戳 `timestamp`。

#### Scenario: 记录写入成功
- **WHEN** 抽奖判定完成
- **THEN** 系统写入一条记录，其中 `result` 为 `win` 或 `lose`，`source` 为 `wechat-sms` 或 `manual`，`timestamp` 为写入时的毫秒时间戳
- **AND** 记录中 MUST NOT 保存完整明文手机号

#### Scenario: 记录写入失败
- **WHEN** 写入请求返回错误
- **THEN** 系统向用户展示「结果保存失败，请重试」并允许重试写入，重试 MUST NOT 重新执行概率判定（沿用首次判定结果）

#### Scenario: 抽奖结果可追溯
- **WHEN** 运营人员在 CloudBase 控制台查看 `lucky_draw_record`
- **THEN** 每条记录可通过 `phoneKey` 与白名单条目对应，并可按 `timestamp` 排序查看参与顺序

### Requirement: 抽奖页面交互与结果呈现
系统 SHALL 提供一个移动端优先的抽奖页面，包含转盘动画与明确的结果展示，并在各阶段给出加载与错误反馈。

#### Scenario: 转盘动画
- **WHEN** 用户点击抽奖按钮且校验通过
- **THEN** 系统播放不少于 2 秒的转盘旋转动画，动画结束后再展示结果，且最终指向的扇区与判定结果一致

#### Scenario: 中奖结果展示
- **WHEN** 判定结果为中奖
- **THEN** 页面展示「恭喜中奖」标题、奖品名称与领奖说明文案

#### Scenario: 未中奖结果展示
- **WHEN** 判定结果为未中奖
- **THEN** 页面展示未中奖安慰文案，且不展示奖品名称

#### Scenario: 移动端适配
- **WHEN** 页面在宽度不超过 768px 的设备上渲染
- **THEN** 卡片占满屏幕宽度、按钮最小高度不低于 48px、转盘按视口宽度等比缩放

#### Scenario: 请求进行中的反馈
- **WHEN** 系统正在执行发送短信、白名单查询、查重或写入记录等异步操作
- **THEN** 页面展示加载态且相关按钮禁用，避免用户重复提交
