import axios from 'axios'
import md5 from 'js-md5'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 60000, // request timeout
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'       //formdata格式
    'Content-Type': 'application/json' // json格式
  },
  // 在请求之前对data传参进行格式转换
  transformRequest: [function(data, headers) {
    if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
      return data
    } else {
      if (!headers.sign) {
        const new_data = JSON.stringify(data)
        let string = ''
        if (!new_data) {
          string = md5('key=f4d53fa55eab937660c088ade0ca6caa').toUpperCase()
        } else {
          string = md5('data=' + new_data.replace(/\s|\\/g, '') + '&key=f4d53fa55eab937660c088ade0ca6caa').toUpperCase()
        }
        headers.sign = string
      }
      return JSON.stringify(data)
    }
  }]
})
service.interceptors.request.use(
  config => {
    config.headers.Authorization = getToken()
    config.headers.token = getToken()
    if (config.method === 'get') {
      if (config.params) {
        for (const key in config.params) {
          config.params[key] = String(config.params[key])
        }
        const new_data = JSON.stringify(config.params)
        config.headers.sign = md5('data=' + new_data.replace(/\s|\\/g, '') + '&key=f4d53fa55eab937660c088ade0ca6caa').toUpperCase()
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  //  获取http信息，如头信息或状态信息
  response => {
    const res = response.data
    if (res.code === 1001 || res.code === 1002) {
      // token失效
      MessageBox.confirm('请重新登录', '提示', {
        confirmButtonText: '返回登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (res.code !== undefined && res.code !== 200 && res.code !== 4999) {
      if (res.message || res.msg) {
        Message({
          message: res.message || res.msg || 'Error Request',
          type: 'warning',
          duration: 10 * 1000
        })
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
