<template>
  <div>
    <el-dialog
      title="Edit options"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
      class="dialog-border"
      @open="openOptionDialog"
    >
      <el-alert
        title="错误提示的文案"
        type="error"
        class="mb20"
      />
      <div class="flexbox">
        <div class="grid-view">
          <div v-for="(item, key) in copyList" :key="key" class="gridbox">
            <div class="grid-1"><el-input v-model="item.option" autocomplete="off" placeholder="Option name" @change="changeOption(item, key)" /></div>
            <div class="grid-2">
              <div v-if="!item.isShow" class="option-tag">
                <el-tag
                  v-for="(tag, index) in item.tags"
                  :key="index"
                  disable-transitions
                  :closable="item.tags.length > 1"
                  type="info"
                  @close="removeTag(item, tag, index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div v-else>
                <el-input v-model="item.newTag" class="w-200" autocomplete="off" placeholder="Default Meterial" @change="updateNewTag(item, key)" />
              </div>
            </div>
            <div class="grid-3">
              <div v-if="copyList.length != 1" class="flexbox justify-center align-center">
                <div v-show="item.isShow || item.tags.length == 1" class="del-icon" @click="delOption(key)">
                  <i class="el-icon-delete" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button v-show="copyList.length < 3" size="small" plain @click="addOption">Add another option</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditOption">Done</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Removing options will also delete variants" :visible.sync="tipDialogVisible" width="30%" class="dialog-border">
      <div>
        Saving this product will delete 1 variant with the following options:
      </div>
      <ul class="confirm-del-list">
        <li v-for="(l, k) in showTagList" :key="k">
          <span>{{ l.title }}</span>: <span>{{ l.value }}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="done">Done</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'edit-options',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    listData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      orgList: [],
      copyList: [],
      removeTagList: [],
      delList: [],
      changeList: [],
      addList: [],
      showTagList: [],
      isEdit: false,
      tipDialogVisible: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(newVal, oldVal) {
        this.$emit('update:visible', newVal)
      }
    }
  },
  created() {},
  methods: {
    openOptionDialog() {
      this.copyList = JSON.parse(JSON.stringify(this.options))
      this.orgList = JSON.parse(JSON.stringify(this.options))
      this.tableData = JSON.parse(JSON.stringify(this.listData))
      this.removeTagList = []
      this.delList = []
      this.changeList = []
      this.addList = []
      this.showTagList = []
      this.isEdit = false
    },
    confirmEditOption() {
      this.dialogVisible = false
      if (this.isEdit) {
        this.tipDialogVisible = true
      } else {
        this.copyList.forEach(i => {
          i.isShow = false
          i.newTag = ''
        })
        this.$emit('update:sku', {
          delList: this.delList,
          tagList: this.removeTagList,
          copyList: this.copyList,
          changeList: this.changeList,
          addList: this.addList
        })
      }
    },
    done() {
      this.tipDialogVisible = false
      this.copyList.forEach(i => {
        i.isShow = false
        i.newTag = ''
      })
      this.$emit('update:sku', {
        delList: this.delList,
        tagList: this.removeTagList,
        copyList: this.copyList,
        changeList: this.changeList,
        addList: this.addList
      })
    },
    removeTag(item, val, index) {
      this.isEdit = true
      item.tags.splice(index, 1)
      this.removeTagList.push({ title: item.option, value: val })
      this.showTagList.push({ title: item.option, value: val })
    },
    addOption() {
      this.copyList.push({ isShow: true, option: 'Material', tags: [], newTag: '' })
    },
    updateNewTag(item, index) {
      console.log(item)
      item.tags.push(item.newTag)
      this.addList.push(item)
    },
    changeOption(item, index) {
      console.log('changeOption', item, index)
      if (!item.isShow) {
        const val = this.orgList[index]
        console.log(val)
        const found = this.changeList.findIndex(c => c.key === index)
        if (found === -1) {
          this.changeList.push({ key: index, original: val.option, change: item.option })
        } else {
          const original = this.changeList[found].original
          if (item.option === original) {
            this.changeList.splice(found, 1)
          } else {
            this.changeList[found].change = item.option
          }
        }
        this.changeList.forEach(c => {
          this.removeTagList.forEach(t => {
            if (c.original === t.title) {
              console.log('trtue')
              t.title = c.change
            }
          // t.title = item.option
          })
        })
      }
      console.log(this.changeList)
    },
    delOption(index) {
      const item = this.copyList[index]
      this.delList.push(item)
      this.showTagList.push({ title: item.option, value: item.tags[0] })
      this.copyList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-del-list {
  margin-top: 15px;
}
.grid-view {
  .gridbox {
    display: grid;
    grid-template-columns: minmax(150px,3fr) 6fr 1fr;
    grid-gap: 1.6rem;
    margin-bottom: 1.6rem;
    .option-tag .el-tag {
      margin: 0 .4rem .4rem 0;
      &.el-tag--info {
        background-color:rgb(228, 229, 231);
        border-color: #e9e9eb;
        color: rgb(32, 34, 35);
      }
    }
  }
}
.del-icon {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: rgba(246, 246, 247, 1);
  }
}
</style>
