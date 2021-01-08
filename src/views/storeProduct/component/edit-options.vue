<template>
  <div>
    <el-dialog title="Edit options" :visible.sync="dialogVisible" width="30%" class="dialog-border" @open="openOptionDialog">
      <div class="flexbox">
        <div class="grid-view">
          <div v-for="(item, key) in copyList" :key="key" class="gridbox">
            <div><el-input v-model="item.option" autocomplete="off" placeholder="Option name" /></div>
            <div>
              <div class="option-tag">
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
            </div>
          </div>
        </div>
      </div>
      <el-button size="small" plain>Add another option</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditOption">Done</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Removing options will also delete variants" :visible.sync="tipDialogVisible" width="30%" class="dialog-border">
      <div>
        Saving this product will delete 1 variant with the following options:
      </div>
      <ul>
        <li v-for="(l, k) in delList" :key="k">
          <span>{{ l.title }}</span>:<span>{{ l.value }}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="tipDialogVisible = false">Done</el-button>
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
    },
    confirmEditOption() {
      this.dialogVisible = false
      if (this.isEdit) {
        this.tipDialogVisible = true
      }
    },
    removeTag(item, val, index) {
      console.log(item, val)
      this.isEdit = true
      item.tags.splice(index, 1)
      this.delList.push({ title: item.option, value: val })
    }
  }
}
</script>
<style scoped>
</style>
