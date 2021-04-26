import request from '@/utils/request'

// 账单列表
export function getOrderBillList(params) {
  return request({
    url: '/order/bill/index',
    method: 'get',
    params
  })
}
// 账单详情
export function getOrderBillDetail(params) {
  return request({
    url: '/order/bill/bill-detail',
    method: 'get',
    params
  })
}
// 完成账单订单列表
export function getOrderBillFinish(params) {
  return request({
    url: '/order/bill/finish',
    method: 'get',
    params
  })
}
// 获取账单订单列表
export function OrderBillDetail(params) {
  return request({
    url: '/order/bill/order-detail',
    method: 'get',
    params
  })
}
