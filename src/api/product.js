import request from '@/utils/request'
// 上传图片接口
export function uploadImage(data) {
  return request({
    url: '/image_upload',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  })
}
//列表
export function getProductList(params) {
  return request({
    url: '/goods/goods/goods-list',
    method: 'get',
    params
  })
}
//回显
export function getProductEdit(params) {
  return request({
    url: '/goods/goods/good-edit',
    method: 'get',
    params
  })
}
//新增产品
export function getProductSave(data) {
  return request({
    url: '/goods/goods/goods-save',
    method: 'post',
    data
  })
}
// 删除sku
export function getDeleteSku(params) {
  return request({
    url: '/goods/goods/delete-sku',
    method: 'get',
    params
  })
}
//删除商品
export function getProductDelete(data) {
  return request({
    url: '/goods/goods/delete-product',
    method: 'post',
    data
  })
}
