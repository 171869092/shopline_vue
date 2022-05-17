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
// 清除订单异常
export function clearOrderException(params) {
  return request({
    url: '/order_clear_exception',
    method: 'get',
    params
  })
}
// 获取委托管产品
export function getOrderGoods(params) {
  return request({
    url: '/order_get_order_goods',
    method: 'get',
    params
  })
}
// 托管产品
export function orderJoinQueue(data) {
  return request({
    url: '/order_join_queue',
    method: 'post',
    data
  })
}
