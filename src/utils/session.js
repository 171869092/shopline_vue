// 保存sessionStorage
export function setSession(key = '_', value) {
  return sessionStorage.setItem(key, JSON.stringify(value))
}

// 获取sessionStorage
export function getSession(key) {
  if (sessionStorage.getItem(key) && sessionStorage.getItem(key) !== 'undefined') {
    return JSON.parse(sessionStorage.getItem(key))
  } else {
    return false
  }
}

// 移除sessionStorage
export function removeSession(key) {
  return sessionStorage.removeItem(key)
}

// 移除所有sessionStorage
export function clearSession() {
  return sessionStorage.clear()
}
