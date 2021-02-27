import request from '@/utils/request'

export function templateList(params) {
  return request({
    url: '/template_index',
    method: 'get',
    params
  })
}

export function templateAdd(data) {
  return request({
    url: '/template_add',
    method: 'post',
    data: data
  })
}

export function templateEdit(data) {
  return request({
    url: '/template_edit',
    method: 'post',
    data: data
  })
}

// 模板启用或者禁用
export function templateEditUse(data) {
  return request({
    url: '/template_edit_use',
    method: 'get',
    params: data
  })
}
