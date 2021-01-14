import request from '@/utils/request'

export function shopList(params) {
  return request({
    url: '/shop_list',
    method: 'get',
    params
  })
}

export function connectStore(data) {
  return request({
    url: '/l',
    method: 'get',
    params: data
  })
}

export function testStoreConnect(params) {
  return request({
    url: '/ts',
    method: 'post',
    data: params
  })
}

export function editStore(params) {
  return request({
    url: '/edit',
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

export function c_name(params) {
  return request({
    url: '/c_name',
    method: 'get',
    params
  })
}
