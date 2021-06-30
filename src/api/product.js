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
export function deleteSku(data) {
  return request({
    url: '/de',
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
// 获取国家
export function getCountryList(params) {
  return request({
    url: '/goods/goods/country-list',
    method: 'get',
    params
  })
}

// 产品成本
export function productCost(data) {
  return request({
    url: '/product_cost',
    method: 'post',
    data
  })
}

// 产品SKU成本
export function productSkuCost(data) {
  return request({
    url: '/sku_cost',
    method: 'post',
    data
  })
}

// ManualSync
export function ManualSync(params) {
  return request({
    url: '/goods/goods/manual-sync',
    method: 'get',
    params
  })
}

// 报价列表
export function getQuotedList(params) {
  return request({
    url: '/goods/goods/quoted-list',
    method: 'get',
    params
  })
}

// 获取状态标签
export function getQuotedLabel(params) {
  return request({
    url: '/goods/goods/quoted-label ',
    method: 'get',
    params
  })
}

// 创建报价
export function createQuoted(data) {
  return request({
    url: '/goods/goods/create-quoted',
    method: 'post',
    data
  })
}

// 报价详情
export function getQuotedEdit(params) {
  return request({
    url: '/goods/goods/quoted-edit',
    method: 'get',
    params
  })
}

// 删除报价
export function deleteQuoted(data) {
  return request({
    url: '/goods/goods/quoted-del',
    method: 'post',
    data
  })
}

// adopt
export function upStatusQuoted(data) {
  return request({
    url: '/goods/goods/up-status',
    method: 'post',
    data
  })
}
