import request from '@/utils/request'
// 上传图片接口
export function uploadImage(data) {
  return request({
    url: '/image_upload',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' }
  })
}
// 店铺列表
export function getProductList(params) {
  return request({
    url: '/goods_list',
    method: 'get',
    params
  })
}
// 全部产品列表
export function getAllProductList(params) {
  return request({
    url: '/all_goods',
    method: 'get',
    params
  })
}
// 获取店铺
export function getStoreList(params) {
  return request({
    url: '/goods/goods/store-list ',
    method: 'get',
    params
  })
}
// 回显
export function getProductEdit(params) {
  return request({
    url: '/all_goods_edit',
    method: 'get',
    params
  })
}
// 新增产品
export function getProductSave(data) {
  return request({
    url: '/goods_save',
    method: 'post',
    data
  })
}
// 批量删除商品
export function allProductDelete(data) {
  return request({
    url: '/all_goods_delete',
    method: 'post',
    data
  })
}

// 服务商列表
export function getServiceList(params) {
  return request({
    url: '/goods/goods/service-list',
    method: 'get',
    params
  })
}

// 托管服务商
export function getProductService(data) {
  return request({
    url: '/goods/goods/products-service',
    method: 'post',
    data
  })
}
// 取消托管
export function getCancelHosting(data) {
  return request({
    url: '/goods/goods/cancel-hosting',
    method: 'post',
    data
  })
}
