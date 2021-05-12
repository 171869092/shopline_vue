import request from '@/utils/request'

// 客户消息列表
export function getMessageList(params) {
  return request({
    url: 'system/notifation/list',
    method: 'get',
    params
  })
}// 是否有未读消息
export function getUnreadMessage(params) {
  return request({
    url: '/system/notifation/have-msg',
    method: 'get',
    params
  })
}
// 传递有未读消息
export function transferUnreadMessage(params) {
  return request({
    url: '/system/notifation/update-read',
    method: 'get',
    params
  })
}
// 同意改价
export function agreeToChangeThePrice(data) {
  return request({
    url: '/system/notifation/agree-change',
    method: 'post',
    data: data
  })
}
// 拒绝改价
export function refuseToChangeThePrice(data) {
  return request({
    url: '/system/notifation/refuse-change',
    method: 'post',
    data: data
  })
}
