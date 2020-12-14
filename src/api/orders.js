import request from '@/utils/request'

export function getOrderTabs(params) {
  return request({
    url: '/order/order/tab-list',
    method: 'get',
    params
  })
}
// 订单列表
export function getOrderList(params) {
  return request({
    url: '/order_index',
    method: 'get',
    params
  })
}
// 订单物流
export function getLogisticIndex(params) {
  return request({
    url: '/order_logistics_index',
    method: 'get',
    params
  })
}
// 订单物流
export function getLogisticInfo(params) {
  return request({
    url: '/order_logistics_info',
    method: 'get',
    params
  })
}
// 订单详情
export function getOrderInfo(params) {
  return request({
    url: '/order_info',
    method: 'get',
    params
  })
}
