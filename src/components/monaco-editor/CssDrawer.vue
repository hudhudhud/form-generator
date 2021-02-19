<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose" :wrapperClosable="false">
      <div class="action-bar" :style="{'text-align': 'left'}">
        <!-- <span class="bar-btn" @click="refresh">
          <i class="el-icon-refresh" />
          刷新
        </span> -->
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
          复制css
        </span>
        <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
          <i class="el-icon-circle-close" />
          关闭
        </span>
      </div>
      <div id="editorCss" class="json-editor" />
    </el-drawer>
  </div>
</template>

<script>
import { beautifierConf } from '@/utils/index'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

let beautifier
let monaco

export default {
  components: {},
  props: {
    value:''
  },
  data() {
    return {
        cssStr:''
    }
  },
  computed: {},
  watch: {
    value:{
        handler(v){
            this.cssStr = v
        },
        immediate:true,
    },
    cssStr:{
        handler(v){
            this.$emit('input',v)
        },
    }
  },
  created() {},
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: trigger => {
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return this.beautifierJson
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      loadBeautifier(btf => {
        beautifier = btf
        this.beautifierJson = beautifier.js(this.cssStr, beautifierConf.js)

        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorCss', this.beautifierJson)
        })
      })
    },
    onClose() {},
    setEditorValue(id, codeStr) {
      if (this.cssEditor) {
        this.cssEditor.setValue(codeStr)
      } else {
        this.cssEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'css',
          automaticLayout: true
        })
        //用户手动输入
        this.cssEditor.onDidChangeModelContent((event) => {
          this.cssStr = this.cssEditor.getValue();
        })
        // ctrl + s 刷新
        this.cssEditor.onKeyDown(e => {
          if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
            this.refresh()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

::v-deep .el-drawer__header {
  display: none;
}
@include action-bar;

.json-editor{
  height: calc(100vh - 33px);
}
</style>
