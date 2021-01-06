
<template>
  <div
    class="el-input-tag input-tag-wrapper"
    @click="foucusTagInput"
  >
    <el-tag
      v-for="(tag, idx) in innerTags"
      :key="idx"
      v-bind="$attrs"
      type="info"
      :closable="!readOnly"
      :disable-transitions="true"
      @close="remove(idx)"
    >
      {{ tag }}
    </el-tag>
    <input
      v-if="!readOnly"
      v-model="newTag"
      class="tag-input"
      @keydown.delete.stop="removeLastTag"
      @keydown="addNew"
      @blur="addNew"
    >
  </div>
</template>

<script>
export default {
  name: 'el-input-tag',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    addTagOnKeys: {
      type: Array,
      default: () => [13, 188, 9]
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTag: '',
      innerTags: [...this.value]
    }
  },
  watch: {
    value() {
      this.innerTags = [...this.value]
    }
  },
  methods: {
    foucusTagInput() {
      if (this.readOnly || !this.$el.querySelector('.tag-input')) {
        return
      }
      this.$el.querySelector('.tag-input').focus()
    },
    addNew(e) {
      if (e && (!this.addTagOnKeys.includes(e.keyCode)) && (e.type !== 'blur')) {
        return
      }
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      let addSuucess = false
      if (this.newTag.includes(',')) {
        this.newTag.split(',').forEach(item => {
          if (this.addTag(item.trim())) {
            addSuucess = true
          }
        })
      } else {
        if (this.addTag(this.newTag.trim())) {
          addSuucess = true
        }
      }
      if (addSuucess) {
        this.tagChange()
        this.newTag = ''
      }
    },
    addTag(tag) {
      tag = tag.trim()
      if (tag && !this.innerTags.includes(tag)) {
        this.innerTags.push(tag)
        return true
      }
      return false
    },
    remove(index) {
      this.innerTags.splice(index, 1)
      this.tagChange()
    },
    removeLastTag() {
      if (this.newTag) {
        return
      }
      this.innerTags.pop()
      this.tagChange()
    },
    tagChange() {
      this.$emit('input', this.innerTags)
    }
  }
}
</script>

<style scoped>
  .input-tag-wrapper {
    position: relative;
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    outline: none;
    line-height: 34px;
    /* padding: 0 10px 0 5px; */
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .el-tag {
    margin-top: 5px;
    margin-left: 5px;
  }
  .tag-input {
    background: transparent;
    border: 0;
    font-size: inherit;
    outline: none;
    padding-left: 0;
    width: 93%;
  }
  .tag-input {
    padding: 5px;
  }
</style>
