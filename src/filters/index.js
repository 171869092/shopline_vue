// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * @param {String} img
 */
export function thumbnail(img) {
  if (/.jpg/g.test(img)) {
    return img.replace(/.jpg/g, '_150x150.jpg')
  }
  return img
}
