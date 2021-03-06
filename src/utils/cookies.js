import Cookies from 'js-cookie'

export function getCookies(name) {
  return Cookies.get(name)
}

export function setCookies(name, value, expires = 1) {
  return Cookies.set(name, value, { expires: expires, path: '/' })
}

export function removeCookies(name) {
  return Cookies.remove(name)
}

export function removeAllCookies() {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    var neededAttributes = {
      // Here you pass the same attributes that were used when the cookie was created
      // and are required when removing the cookie
    }
    Cookies.remove(cookieName, neededAttributes)
  })
}
