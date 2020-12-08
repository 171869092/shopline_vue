// 设置localStorage
export function setStorage(key = '_', value) {
  return localStorage.setItem(key, JSON.stringify(value))
}

// 获取localStorage
export function getStorage(key) {
  // return JSON.parse(localStorage.getItem(key))
  if (localStorage.getItem(key) && localStorage.getItem(key) !== 'undefined') {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return false
  }

  // return localStorage.getItem(key)
}

// 移除localStorage
export function removeStorage(key) {
  return localStorage.removeItem(key)
}

// 移除所有localStorage
export function clearStorage() {
  return localStorage.clear()
}
