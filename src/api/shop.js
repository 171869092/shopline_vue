import request from '@/utils/request'

export function shopList(params) {
  return request({
    url: '/shop_list',
    method: 'get',
    params
  })
}
