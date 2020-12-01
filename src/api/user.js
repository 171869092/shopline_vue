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
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function productApi(url, token, data = {}) {
  return request({
    url: url,
    method: 'get',
    params: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Shopify-Access-Token': `${token}`
    }
  })
}

export function indexApi(data) {
  return request({
    url: 'https://fdapi.dongketech.com/site/indexs',
    method: 'get',
    params: data
  })
}

export function gtoken(data) {
  return request({
    url: 'https://fdapi.dongketech.com/site/generatr-token',
    method: 'get',
    params: data
  })
}
