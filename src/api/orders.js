import request from '@/utils/request'

export function getOrderTabs(params) {
  return request({
    url: '/order/order/tab-list',
    method: 'get',
    params
  })
}
export function getOrderList(params) {
  return request({
    url: '/order/order/index',
    method: 'get',
    params
  })
}
export function getLogisticInfo(params) {
  return request({
    url: '/order/order-logistics/way-bill-info',
    method: 'get',
    params
  })
}
export function getOrderInfo(params) {
  return request({
    url: '/order/order/get-order-info',
    method: 'get',
    params
  })
}
