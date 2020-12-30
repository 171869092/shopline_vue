import request from '@/utils/request'
// 上传图片接口
export function uploadImage(data, cb) {
  return request({
    url: '/image_upload',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
    onUploadProgress: progressEvent => cb(progressEvent)
  })
}
// 获取店铺信息
export function getStoreList(params) {
  return request({
    url: '/goods/goods/store-list ',
    method: 'get',
    params
  })
}
// 店铺商品列表
export function getStoreProductList(params) {
  return request({
    url: '/goods_list',
    method: 'get',
    params
  })
}
// 店铺商品回显
export function getStoreProductEdit(params) {
  return request({
    url: '/goods_edit',
    method: 'get',
    params
  })
}
// 店铺商品新增
export function getStoreProductSave(data) {
  return request({
    url: '/goods_save',
    method: 'post',
    data
  })
}
// 店铺产品推送shopify
export function getStorePushProduct(data) {
  return request({
    url: '/push_products',
    method: 'post',
    data
  })
}
// 全部商品列表
export function getAllProductList(params) {
  return request({
    url: '/all_goods',
    method: 'get',
    params
  })
}
// 全部商品回显
export function getAllProductEdit(params) {
  return request({
    url: '/all_goods_edit',
    method: 'get',
    params
  })
}
// 全部商品新增
export function getAllProductSave(data) {
  return request({
    url: '/all_goods_save',
    method: 'post',
    data
  })
}
// 删除产品sku
export function getDeleteSku(params) {
  return request({
    url: '/goods/goods/delete-sku',
    method: 'get',
    params
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

// 获取服务商列表
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
// 全部商品分配店铺
export function allGoodsSelectStore(data) {
  return request({
    url: '/all_goods_select_store ',
    method: 'post',
    data
  })
}
