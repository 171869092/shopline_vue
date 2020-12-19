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

export function removeAllCookies() {
  Object.keys(Cookies.get()).forEach(function(cookieName) {
    var neededAttributes = {
      // Here you pass the same attributes that were used when the cookie was created
      // and are required when removing the cookie
    }
    Cookies.remove(cookieName, neededAttributes)
  })
}
