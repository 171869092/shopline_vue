import request from '@/utils/request'

// . after sale list
export function afterSalesList(params) {
  return request({
    url: '/after/after-sales/index',
    method: 'get',
    params
  })
}

// . after sale detail
export function afterSalesDetail(params) {
  return request({
    url: '/after/after-sales/details',
    method: 'get',
    params
  })
}

// . after sale type
export function afterSalesType() {
  return request({
    url: '/after/after-sales/type',
    method: 'get'
  })
}

// . after sale create
export function afterSalesCreate(data) {
  return request({
    url: '/after/after-sales/create',
    method: 'post',
    data: data
  })
}

// . after sale channged status
export function afterSalesChanngedStatus(data) {
  return request({
    url: '/after/after-sales/finish',
    method: 'post',
    data: data
  })
}

// . after sale confirm send
export function afterSalesConfirmSend(data) {
  return request({
    url: '/after/after-sales/confirm-send',
    method: 'post',
    data: data
  })
}
