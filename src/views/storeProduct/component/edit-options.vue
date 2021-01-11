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
        v-show="showAlert"
        title="Option names cannot be the same!"
        type="error"
        class="mb20"
      />
      <div class="flexbox">
        <div class="grid-view">
          <div v-for="(item, key) in copyList" :key="key" class="gridbox">
            <div class="grid-1"><el-input v-model="item.option" autocomplete="off" placeholder="Option name" @change="changeOptionName(item, key)" /></div>
            <div class="grid-2">
              <div v-if="!item.isAdd" class="option-tag">
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
                <div v-show="item.isAdd || item.tags.length == 1" class="del-icon" @click="deleteOption(key)">
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
      showAlert: false,
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
      this.copyList.push({ isAdd: true, option: 'Material', tags: [], newTag: '' })
    },
    updateNewTag(item, index) {
      console.log(item)
      item.tags.push(item.newTag)
      this.addList.push(item)
      console.log('addList', this.addList)
    },
    changeOptionName(item, index) {
      console.log(item)
      const even = this.copyList.map(i => i.option).filter(f => f === item.option)
      even.length > 1 ? this.showAlert = true : this.showAlert = false
      if (!this.showAlert) {
        if (!item.isAdd) {
          const val = this.orgList[index]
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
      }
      console.log('changeList', this.changeList)
    },
    deleteOption(index) {
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
