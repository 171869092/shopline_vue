import Cookies from 'js-cookie'

export function getCookies(name) {
  if (Cookies.get(name) && Cookies.get(name) !== 'undefined') {
    return JSON.parse(Cookies.get(name))
  } else {
    return false
  }
}

export function setCookies(name, value, expires = 1) {
  return Cookies.set(name, JSON.stringify(value), { expires: expires })
}

export function removeCookies(name) {
  return Cookies.remove(name)
}
