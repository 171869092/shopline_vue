import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/site/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/site/login-out',
    method: 'post'
  })
}

export function shopifyApi(data) {
  return request({
    url: '/shopify/index/indexs',
    method: 'get',
    params: data
  })
}

export function shopifyPush(data) {
  return request({
    url: '/shopify/index/push',
    method: 'get',
    params: data
  })
}

export function gtoken(data) {
  return request({
    url: '/site/generatr-token',
    method: 'get',
    params: data
  })
}

export function sendEmail(data) {
  return request({
    url: '/site/send-email',
    method: 'post',
    data: data
  })
}

export function baseChartIndex(data) {
  return request({
    url: '/base/chart/index',
    method: 'get',
    params: data
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/base/index/change-password',
    method: 'post',
    data: data
  })
}
// 个人中心获取用户基本信息
export function findUserInfo(data) {
  return request({
    url: '/base/index/find-user-info',
    method: 'get',
    params: data
  })
}
// 个人中心获取店铺
export function getGoodsStoreList(data) {
  return request({
    url: '/goods/goods/store-list',
    method: 'get',
    params: data
  })
}
// 个人中心修改用户信息
export function updateUserInfo(data) {
  return request({
    url: '/base/index/update-user-info',
    method: 'post',
    data: data
  })
}
// 真实用户售后
export function realInfo(data) {
  return request({
    url: '/after/after/reacl-info',
    method: 'get',
    params: data
  })
}
// 真实用户售后提交
export function afterSalesReal(data) {
  return request({
    url: '/after/after/reacl',
    method: 'post',
    data: data
  })
}
// 真实用户售后上传图片
export function updateAfterInfo(data, cb) {
  return request({
    url: '/after/after/upload',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
    onUploadProgress: progressEvent => cb(progressEvent)
  })
}
// . after sale type
export function afterSalesType() {
  return request({
    url: '/after/after/type',
    method: 'get'
  })
}

// . after sale reply
export function afterSalesReply(data) {
  return request({
    url: '/after/after/reply',
    method: 'post',
    data: data
  })
}
