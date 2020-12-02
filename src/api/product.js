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
export function getProductList(params) {
  return request({
    url: '/goods/goods/goods-list',
    method: 'get',
    params
  })
}
