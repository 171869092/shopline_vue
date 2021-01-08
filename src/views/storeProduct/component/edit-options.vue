<template>
  <div>
    <el-dialog title="Edit options" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%" class="dialog-border" @open="openOptionDialog">
      <div class="flexbox">
        <div class="grid-view">
          <div v-for="(item, key) in copyList" :key="key" class="gridbox">
            <div class="grid-1"><el-input v-model="item.option" autocomplete="off" placeholder="Option name" /></div>
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
                <el-input v-model="newTag" class="w-200" autocomplete="off" placeholder="Default Meterial" @blur="updateOption(key)" />
              </div>
            </div>
            <div class="grid-3">
              <div v-show="item.isShow || item.tags.length == 1" class="flexbox justify-center align-center">
                <div class="del-icon" @click="delOption(key)">
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
        <li v-for="(l, k) in delList" :key="k">
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
    }
  },
  data() {
    return {
      copyList: [],
      delList: [],
      newTag: '',
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
      this.delList = []
      this.newTag = ''
    },
    confirmEditOption() {
      this.dialogVisible = false
      if (this.isEdit) {
        this.tipDialogVisible = true
      } else {
        this.$emit('update:sku', this.copyList)
      }
    },
    done() {
      this.tipDialogVisible = false
      this.$emit('delete:sku', {
        delList: this.delList,
        orgList: this.copyList
      })
    },
    removeTag(item, val, index) {
      console.log(item, val)
      this.isEdit = true
      item.tags.splice(index, 1)
      this.delList.push({ title: item.option, value: val })
    },
    addOption() {
      this.copyList.push({ isShow: true, option: 'Material', tags: [] })
    },
    delOption(index) {
      this.copyList.splice(index, 1)
    },
    updateOption(index) {
      this.copyList[index].tags = [this.newTag]
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
