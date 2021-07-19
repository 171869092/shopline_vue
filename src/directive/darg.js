import Vue from 'vue'
/**
 * 使用Vue.directive()定义一个全局指令
 * 参数一：指令的名称，定义时指令前面不需要写v-
 * 参数二：是一个对象，该对象中有相关的操作函数
 * 调用时必须写v-
 */
const drag = Vue.directive('drag', {
  bind: function(el) {
    const oDiv = el // 获取当前元素
    let firstTime = ''
    let lastTime = ''
    oDiv.onmousedown = (e) => {
      document.getElementById('dragBtn').setAttribute('data-flag', false)
      firstTime = new Date().getTime()
      // 算出鼠标组相对元素的位置
      const disX = e.clientX - oDiv.offsetLeft
      const disY = e.clientY - oDiv.offsetTop
      document.onmousemove = (e) => {
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const top = e.clientY - disY
        const left = e.clientX - disX
        // 页面范围内移动元素
        if (top > 0 && top < document.body.clientHeight - 48) {
          oDiv.style.top = top + 'px'
          el.style.left = left + 'px'
        }
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        // onmouseup时的时间，并计算差值
        lastTime = new Date().getTime()
        if ((lastTime - firstTime) < 200) {
          document.getElementById('dragBtn').setAttribute('data-flag', true)
        }
      }
    }
  }
})

export default drag
