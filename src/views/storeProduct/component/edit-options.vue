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
        show-icon
        class="mb20"
      />
      <el-alert
        v-show="isError"
        title="Please ensure all fields have been filled."
        type="error"
        show-icon
        class="mb20"
      />
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="0" :show-message="false">
        <div class="flexbox">
          <div class="grid-view">
            <div v-for="(item, key) in formData.copyList" :key="key" class="gridbox">
              <div class="grid-1">
                <el-form-item :prop="'copyList.' + key + '.option'" :rules="{required: true, message: 'Can not be empty',trigger: 'input'}">
                  <el-input v-model="item.option" autocomplete="off" placeholder="Option name" @change="changeOptionName(item, key)" />
                </el-form-item>
              </div>
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
                  <el-form-item :prop="'copyList.' + key + '.newTag'" :rules="{required: true, message: 'Can not be empty',trigger: 'input'}">
                    <el-input v-model="item.newTag" class="w-200" autocomplete="off" placeholder="Default Meterial" @change="updateNewTag(item, key)" />
                  </el-form-item>
                </div>
              </div>
              <div class="grid-3">
                <div v-if="formData.copyList.length != 1" class="flexbox justify-center align-center">
                  <div v-show="item.isAdd || item.tags.length == 1" class="del-icon" @click="deleteOption(key)">
                    <i class="el-icon-delete" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <el-button v-show="formData.copyList.length < 3" size="small" plain @click="addOption()">Add another option</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
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
      formData: {
        copyList: []
      },
      rules: {},
      orgList: [],
      removeTagList: [],
      delList: [],
      changeList: [],
      addList: [],
      showTagList: [],
      optionsName: ['Size', 'Color', 'Material', 'Style', 'Title'],
      isEdit: false,
      isError: false,
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
      this.formData.copyList = JSON.parse(JSON.stringify(this.options))
      this.orgList = JSON.parse(JSON.stringify(this.options))
      this.tableData = JSON.parse(JSON.stringify(this.listData))
      this.removeTagList = []
      this.delList = []
      this.changeList = []
      this.addList = []
      this.showTagList = []
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEdit = false
      this.isError = false
    },
    confirmEditOption() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.showAlert) {
            this.dialogVisible = false
            if (this.isEdit) {
              this.tipDialogVisible = true
            } else {
              this.$emit('update:sku', {
                delList: this.delList,
                tagList: this.removeTagList,
                copyList: this.formData.copyList,
                changeList: this.changeList,
                addList: this.addList
              })
            }
          }
        } else {
          this.isError = true
          return false
        }
      })
    },
    done() {
      this.tipDialogVisible = false
      this.$emit('update:sku', {
        delList: this.delList,
        tagList: this.removeTagList,
        copyList: this.formData.copyList,
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
      this.formData.copyList.push({ isAdd: true, option: 'Material', tags: [], newTag: '' })
      const even = this.formData.copyList.map(i => i.option)
      new Set(even).size !== even.length ? this.showAlert = true : this.showAlert = false
    },
    updateNewTag(item, index) {
      console.log(item)
      if (item.newTag !== '') {
        this.isError = false
        item.tags = [item.newTag]
        this.addList.push(item)
        console.log('addList', this.addList)
      } else {
        this.isError = true
      }
    },
    changeOptionName(item, index) {
      console.log(item)
      if (item.option !== '') {
        const even = this.formData.copyList.map(i => i.option).filter(f => f === item.option)
        even.length > 1 ? this.showAlert = true : this.showAlert = false
        if (!this.showAlert) {
          this.isError = false
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
      } else {
        this.isError = true
      }
      console.log('changeList', this.changeList)
    },
    deleteOption(index) {
      const item = this.formData.copyList[index]
      this.delList.push(item)
      this.showTagList.push({ title: item.option, value: item.tags[0] })
      this.formData.copyList.splice(index, 1)
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
