import request from '@/utils/request'
export function afterSalesList(params) {
    return request({
      url: '/after/after-sales/index',
      method: 'get',
      params
    })
  }