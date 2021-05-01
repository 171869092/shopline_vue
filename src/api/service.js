import request from '@/utils/request'

// 激活服务商列表
export function getGoodsServiceList(params) {
  return request({
    url: '/goods/goods/service-list-page',
    method: 'get',
    params
  })
}
// 激活码
export function getGoodsActivationByCode(data) {
  return request({
    url: '/goods/goods/activation-by-code',
    method: 'post',
    data: data
  })
}
