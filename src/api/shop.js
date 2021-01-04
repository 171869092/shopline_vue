import request from '@/utils/request'

export function shopList(params) {
  return request({
    url: '/shop_list',
    method: 'get',
    params
  })
}
export function shopPush(params) {
  return request({
    url: '/shopify/index/push',
    method: 'get',
    params
  })
}
