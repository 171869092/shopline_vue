import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/site/login',
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

export function gtoken(data) {
  return request({
    url: '/site/generatr-token',
    method: 'get',
    params: data
  })
}
