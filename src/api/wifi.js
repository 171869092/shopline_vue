import request from '@/utils/request'

// wifi测速
export function getBaseMonitor(params) {
  return request({
    url: 'base/index/monitor',
    method: 'get',
    params
  })
}
