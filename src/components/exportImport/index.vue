<!-- 导出组件（纯前端） -->
<template>
  <span>
    <a id="downlink" />
    <span @click="downloadFile">
      <slot name="export">
        <el-button class="button">导出</el-button>
      </slot>
    </span>
    <!-- 错误信息提示 -->
    <el-dialog v-model="errorDialog" title="提示" size="tiny">
      <span>{{ errorMsg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialog=false">确认</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
var XLSX = require('xlsx')
export default {
  name: 'prog-export-import',
  props: {
    setExportData: {
      type: Function,
      default: function() {
        console.warn('未传递获取excel导出数据方法')
      }
    }
  },
  data() {
    return {
      fullscreenLoading: false, // 加载中
      outFile: '', // 导出文件el对象
      errorDialog: false, // 错误信息弹窗
      errorMsg: '', // 错误信息内容
      // excelTitle: {}, // excel标题
      excelData: [] // excel处理数据
    }
  },
  mounted() {
    this.outFile = document.getElementById('downlink')
  },
  methods: {
    downloadFile: function() { // 导出文件点击事件
      const exportData = this.setExportData()
      // this.excelTitle = exportData.excelTitle
      this.excelData = exportData.excelData
      let data = [{}, {}]
      for (const k in this.excelData[0]) { // 设置第1行为数据库字段行
        // eslint-disable-next-line no-prototype-builtins
        if (this.excelData[0].hasOwnProperty(k)) {
          data[0][k] = k
          // data[1][k] = this.excelTitle[k] // 中文标题
        }
      }
      data = data.concat(this.excelData)
      this.downloadExl(data, exportData.excelName || '导出文件')
    },
    downloadExl: function(json, downName, type) { // 导出到excel
      const keyMap = [] // 获取键
      for (const k in json[0]) {
        // eslint-disable-next-line no-prototype-builtins
        if (json[0].hasOwnProperty(k)) {
          keyMap.push(k)
        }
      }
      const tmpdata = [] // 用来保存转换好的json
      json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k] || '',
        position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach(function(v) {
        tmpdata[v.position] = {
          v: v.v
        }
      })
      const outputPos = Object.keys(tmpdata) // 设置区域,比如表格从A1到D10
      const tmpWB = {
        SheetNames: ['sheet'], // 保存的表标题
        Sheets: {
          'sheet': Object.assign({},
            tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            })
        }
      }
      const tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
        { bookType: (type || 'xlsx'), bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
      ))], {
        type: ''
      }) // 创建二进制对象写入转换好的字节流
      var href = URL.createObjectURL(tmpDown) // 创建对象超链接
      this.outFile.download = downName + '.xlsx' // 下载名称
      this.outFile.href = href // 绑定a标签
      this.outFile.click() // 模拟点击实现下载
      setTimeout(function() { // 延时释放
        URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
      }, 100)
    },
    s2ab: function(s) { // 字符串转字符流
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    },
    getCharCol: function(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      let s = ''
      let m = 0
      while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    fixdata: function(data) { // 文件流转BinaryString
      var o = ''
      var l = 0
      var w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    }
  }
}
</script>

<style scoped>

</style>
