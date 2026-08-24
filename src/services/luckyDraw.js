import getCloudbase, { getAuth } from '../cloudbase'

// 中奖概率, 调整概率只需改这里
export const WIN_RATE = 0.15

// TODO 奖品与文案均为占位内容, 上线前替换
export const PRIZE_NAME = '4小时免单'
export const PRIZE_TIP = '请截图本页面联系店长领取奖品'
export const LOSE_TIP = '很遗憾, 本次没有中奖, 感谢参与'
export const DEADLINE_TIP = '活动截止时间: 2026 年 9 月 30 日 23:59'

// 活动截止时间, 截止后不再接受新的抽奖
export const DRAW_DEADLINE = new Date('2026-09-30T23:59:59+08:00').getTime()

const SALT = 'zqblog-lucky-draw-2026'

// 测试白名单: 这里的手机号跳过 lucky_draw_whitelist 集合校验, 方便联调
// TODO 上线前清空, 否则名单外的号码也能参与抽奖
export const TEST_PHONES = ['18112525542']

const WHITELIST_COLLECTION = 'lucky_draw_whitelist'
const RECORD_COLLECTION = 'lucky_draw_record'

export const isValidPhone = phone => /^1[3-9]\d{9}$/.test(phone || '')

export const maskPhone = phone =>
  (phone || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')

export const isExpired = () => Date.now() > DRAW_DEADLINE

export const drawResult = () => (Math.random() < WIN_RATE ? 'win' : 'lose')

// 手机号只以哈希形式落库, 集合公开可读时不暴露完整号码
export const hashPhone = async phone => {
  const buffer = new TextEncoder().encode(`${SALT}${phone}`)
  const digest = await window.crypto.subtle.digest('SHA-256', buffer)

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

const getDatabase = async () => {
  const cloudbaseApp = await getCloudbase()

  return cloudbaseApp.database()
}

export const isInWhitelist = async phone => {
  if (TEST_PHONES.includes(phone)) return true

  const db = await getDatabase()
  const phoneKey = await hashPhone(phone)

  const res = await db
    .collection(WHITELIST_COLLECTION)
    .where({ phoneKey })
    .limit(1)
    .get()

  const doc = res && res.data && res.data[0]

  return Boolean(doc) && doc.enabled !== false
}

export const findRecord = async phone => {
  const db = await getDatabase()
  const phoneKey = await hashPhone(phone)

  const res = await db
    .collection(RECORD_COLLECTION)
    .where({ phoneKey })
    .limit(1)
    .get()

  return (res && res.data && res.data[0]) || null
}

export const saveRecord = async ({ phone, result, prize, source }) => {
  const db = await getDatabase()
  const phoneKey = await hashPhone(phone)

  const record = {
    phoneKey,
    phoneMasked: maskPhone(phone),
    result,
    prize: prize || '',
    source,
    timestamp: new Date().getTime(),
  }

  const res = await db.collection(RECORD_COLLECTION).add(record)

  if (!res || !res.id) {
    throw new Error('抽奖结果写入失败')
  }

  return { ...record, _id: res.id }
}

const toInternationalPhone = phone => `+86 ${phone}`

export const sendSmsCode = async phone => {
  const auth = await getAuth()

  if (typeof auth.getVerification !== 'function') {
    throw new Error('当前 CloudBase SDK 不支持短信验证码登录, 请检查 SDK 版本')
  }

  const info = await auth.getVerification({
    phone_number: toInternationalPhone(phone),
  })

  return {
    verificationId: info.verification_id,
    isUser: Boolean(info.is_user),
  }
}

export const loginWithSmsCode = async ({
  phone,
  code,
  verificationId,
  isUser,
}) => {
  const auth = await getAuth()

  if (typeof auth.verify !== 'function') {
    throw new Error('当前 CloudBase SDK 不支持短信验证码登录, 请检查 SDK 版本')
  }

  const { verification_token: verificationToken } = await auth.verify({
    verification_id: verificationId,
    verification_code: code,
  })

  if (isUser) {
    await auth.signIn({
      username: toInternationalPhone(phone),
      verification_token: verificationToken,
    })
  } else {
    await auth.signUp({
      phone_number: toInternationalPhone(phone),
      verification_code: code,
      verification_token: verificationToken,
    })
  }

  const loggedInPhone = await getLoggedInPhone()

  return loggedInPhone || phone
}

// 取登录态里的手机号, 匿名登录或未登录时返回空字符串
export const getLoggedInPhone = async () => {
  const auth = await getAuth()

  let currentUser = auth.currentUser

  try {
    if (!currentUser && typeof auth.getCurrentUser === 'function') {
      currentUser = await auth.getCurrentUser()
    }
  } catch (e) {
    console.error(e)
  }

  if (!currentUser) return ''

  const digits = String(currentUser.phone_number || currentUser.phone || '')
    .replace(/\D/g, '')
    .slice(-11)

  return isValidPhone(digits) ? digits : ''
}
