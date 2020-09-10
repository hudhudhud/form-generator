
<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <img :src="logo" alt="logo"> Form Generator
          <!-- <a class="github" href="https://github.com/JakHuang/form-generator" target="_blank">
            <img src="https://github.githubassets.com/pinned-octocat.svg" alt>
          </a> -->
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ item.title }}
            </div>
            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon :icon-class="element.__config__.type" />
                  <span v-if='element.__config__.type=="hidden"'>hidden组件</span>
                  <span v-else-if='element.__config__.type=="detail"'>
                    {{element.modeType}}
                  </span>
                  <span v-else>{{element.__config__.label}}</span>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <!-- <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button> -->
       
        <!-- <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button> -->
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="confirmJson">
          保存
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
      </div>
    
      <div class="phone">
        <el-scrollbar class="center-scrollbar">
          <el-row class="center-board-row" :gutter="formConf.gutter">
              <el-form
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
            > 
              <div class="form-container"  :class="{'show':Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length,}">
                 <div v-if='formConf.descHtml' v-html='formConf.descHtml' class="desc-html">
                </div>
                <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                  <draggable-item
                    v-for="(item, index) in drawingList"
                    :key="item.renderKey"
                    :drawing-list="drawingList"
                    :current-item="item"
                    :index="index"
                    :active-id="activeId"
                    :form-conf="formConf"
                    @activeItem="activeFormItem($event,index)"
                    @copyItem="drawingItemCopy"
                    @deleteItem="drawingItemDelete"
                    :class="{actived:activeId == index}"
                  />
                </draggable>
                <div v-show="!drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行表单设计
                </div>
                <template v-if='formConf.showDescPop&&formConf.descPopSetting'>
                    <div @click='showDescPop=true' class="desc-btn" v-if='!showDescPop'>
                        <i class="fa fa-info-circle" aria-hidden="true" ></i>
                        <span>{{formConf.descPopSetting.popBtnTitle?formConf.descPopSetting.popBtnTitle:'注意事项'}}</span>
                    </div>
                    <Popup :setting="formConf.descPopSetting" v-model='showDescPop'/>
                </template>
                <div class="btns"  
                v-if='Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length'
                :class="{'no-space':Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length>2}">
                  <el-button type="primary">提交</el-button>
                  <template v-for='(btn,i) of formConf.customerBtns' >
                      <el-button type="primary" plain  :style='btn.style' :key='i'>{{btn.title}} </el-button> 
                  </template>
                  <el-button type="default">返回</el-button>
              </div> 
              </div>
            </el-form>
          </el-row>
        </el-scrollbar>
       
      </div>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />

    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden">
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import { saveAs } from 'file-saver'
import ClipboardJS from 'clipboard'
import render from '@/components/render/render'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'
import {
  inputComponents, selectComponents,otherComponents, detailComponents,formConf
} from '@/components/generator/config'
import {
  exportDefault, beautifierConf, isNumberStr, titleCase, deepClone
} from '@/utils/index'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import initDrawing from '@/components/generator/initDrawing'
import logo from '@/assets/logo.png'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'
import loadBeautifier from '@/utils/loadBeautifier'
import Popup from '@/components/popup'
import {GET_JSON} from '@/utils/api'
import Request from '@/utils/request'
import {Toast} from 'mint-ui'
let beautifier
const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData
const drawingListInDB = getDrawingList()
const formConfInDB = getFormConf()
const idGlobal = getIdGlobal()

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem,
    Popup
  },
  data() {
    return {
      initDrawing:initDrawing,
      showDescPop:false,
      logo,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      otherComponents,
      detailComponents,
      labelWidth: 100,
      drawingList: [],//drawingDefalut,
      drawingData: {},
      activeId: '',//drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: {},//drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      leftComponents: [
        {
          title: '输入型组件',
          list: inputComponents
        },
        {
          title: '选择型组件',
          list: selectComponents
        },
        // {
        //   title: '布局型组件',
        //   list: layoutComponents
        // }
        // ,
        {
          title: '其他组件',
          list: otherComponents
        },
        {
          title:'明细组件',
          list:detailComponents,
        }
      ]
    }
  },
  computed: {
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined
        || !this.activeData.__config__.tag
        || oldActiveId !== this.activeId
      ) {
        return
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        //this.saveDrawingListDebounce(val)
        if (val.length === 0) this.idGlobal = 100
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
       // this.saveIdGlobalDebounce(val)
      },
      immediate: true
    }
  },
  async mounted() {
    // if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
    //   this.drawingList = drawingListInDB
    // } else {
      //回写json
      if(this.$route.query.orunid){
        try{
          let res =  await Request.post(GET_JSON,{orunid:this.$route.query.orunid})
          this.initDrawing = res.htmlJson
        }
        catch(e){
          console.log(e)
           Toast({
                message:e,
                position:'middle',
                duration:3000
            })
        }
      }
      if(this.initDrawing&&Array.isArray(this.initDrawing['params'])){
        this.initDrawing['params'].forEach((param,i)=>{
          
          if(param.type!=='detail'){
             //非明细
            let res = this.settingInitJson(param)
            this.drawingList.push(res)
          }
          else{
            //明细
            let obj = {}
            Object.keys(param).forEach(key=>{
              if(key!=='params'){
                obj[key]=param[key]
              }
              else{
                obj[key] = param[key].map(item=>{
                  return this.settingInitJson(item)
                  // {
                  //   __config__:deepClone(item)
                  // }
                })
              }
            })
            this.drawingList.push({__config__:{...obj},layout:'rowFormItem'})
          }
        })
      }
      else{
        this.drawingList = drawingDefalut
      }
    // }
  

    this.activeFormItem(this.drawingList[0])
    this.activeId=0

    // if (formConfInDB) {
    //   this.formConf = formConfInDB
    // }
    // else {
      if(this.initDrawing){
        Object.keys(this.initDrawing).forEach((key,i)=>{
          if(key!=='params'){
            this.$set(this.formConf,key,this.initDrawing[key])
          }
        })
      }
    // }
    loadBeautifier(btf => {
      beautifier = btf
    })
    const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  methods: {
    settingInitJson(param){
      let obj = {}
      if(param.show===undefined){
        param.show=true
      }
      if(param.type=='textarea'){
        if(param.autoSize){
          if(typeof param.autoSize==='boolean'){
            obj.settingAutoSize=false
          }
          else if(param.autoSize==='object'){
              obj.settingAutoSize=true
          }
        }
        else{
          obj.settingAutoSize=false
        }
      }
      if(param.labelKey&&param.valueKey){
        obj.optionsType='object'
      }
      else{
         obj.optionsType='value'
      }
      if(typeof param.options == 'string'){
        obj.jsGetOptions=true
      }
      else{
        obj.jsGetOptions=false
      }
      if(param.value){
        if(typeof param.value =='object'){
          obj.defaultValueType='object'
        }
        else{
          obj.defaultValueType='value'
        }
      }
      if(Array.isArray(param.attributes)){
        param.attributes.forEach((it,i)=>{
          if(typeof it.value=='object'){
            if(Array.isArray(it.value)){
              it.value = it.value.join(' ')
            }
            else {
              it.value = Object.keys(it.value).map(key=>{return `${key}:${it.value[key]}`}).join(';')
            }
          }
        })
      }
      return {__config__:{...param},...obj}
    },
    activeFormItem(currentItem,index) {
      this.activeData = currentItem
      this.activeId = index//currentItem.__config__.formId
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item)
      //选择明细，点击直接往明细里添加组件，且不重新选中
      if(this.drawingList.length&&this.activeData.layout=='rowFormItem'&&clone.layout!=='rowFormItem'){
        if(!Array.isArray(this.activeData.__config__.params)){
          this.activeData.__config__.params=[]
        }
        this.activeData.__config__.params.push(clone)
      }
      else{
        this.drawingList.push(clone)
        this.activeFormItem(clone)
      }
    },
    cloneComponent(origin) {
      const clone = deepClone(origin)
      const config = clone.__config__
      config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`
        !Array.isArray(config.params) && (config.params = [])
        delete config.label // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.params)) {
        config.params = config.params.map(childItem => this.createIdAndKey(childItem))
      }
      return item
    },
    AssembleFormData() {
      let draList = this.drawingList.map(it=>it.__config__)
      let resultList = deepClone(draList)
      resultList.forEach(it=>{
        delete it.formId
        delete it.renderKey
        delete it.componentName
        if(it.type=='detail'){
          if(!it.params)it.params=[]
          it.params = it.params.map(it=>it.__config__)
          it.params.forEach(item=>{
            delete item.formId
            delete item.renderKey
            delete it.componentName
          })
        }
      }) 
      console.log(3333,resultList)     
      this.formData = {
        params: resultList,
        ...this.formConf
      }
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`]
      this.generateConf = data
      func && func(data)
    },
    execRun(data) {
      this.AssembleFormData()
      this.drawerVisible = true
    },
    execDownload(data) {
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, data.fileName)
    },
    execCopy(data) {
      document.getElementById('copyNode').click()
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          this.formConf={}
          this.idGlobal = 100
        }
      )
    },
    drawingItemCopy(item, list) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },
    drawingItemDelete(index, list) {
      list.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    generateCode() {
      const { type } = this.generateConf
      this.AssembleFormData()
      const script = vueScript(makeUpJs(this.formData, type))
      const html = vueTemplate(makeUpHtml(this.formData, type))
      const css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    showJson() {
      this.AssembleFormData()
      this.jsonDrawerVisible = true
    },
    confirmJson(){
      this.AssembleFormData()
      let jsonString = JSON.stringify(this.formData)
      let beautifierJson = beautifier.js(jsonString, beautifierConf.js)
      console.log('saveJson...',beautifierJson)
      window.parent.parentSetJson(beautifierJson); 
    },
    download() {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    run() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    copy() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.type = config.type
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.params)) this.updateDrawingList(newTag, item.__config__.params)
        })
      }
    },
    refreshJson(data) {
      this.drawingList = deepClone(data.params)
      delete data.params
      this.formConf = data
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/home';
</style>
<style scoped lang='scss'>
.phone{
    margin: 20px 20px 0;
    background-image: url('../../assets/phone.png');
    background-repeat: no-repeat;
    background-size: 100%;
    height: 100%;
    padding: 100px 16px;
    box-sizing: border-box;
    width: 375px;
    margin: auto;
    position:relative;
    .el-form{
      // https://segmentfault.com/q/1010000010677322
      //让所有position:fixed元素相对父元素定位，translate之后，fix相对窗口定位失效，相对父元素
      transform:translate(0,0);
      width:100%;
      box-sizing: border-box;
      overflow: hidden;
       //position:fixed元素滚动时需要固定位置，因此增加相对定位容器
      .form-container{
        padding-top:10px;
        position:relative;
        width:100%;
        height:100%;
        overflow: auto;
        box-sizing: border-box;
         &.show{
          padding-bottom:60px;
        }
      }
      .actived{
        border:1px solid red;
      }
    }
    .desc-html{
      border-bottom:1px solid #d9d9d9;
    }
    .desc-btn{
        position:fixed;
        bottom:100px;
        right:5px;  
        background-color:#CFD6DF;
        color:#fff;
        border-radius:5px;
        font-size:12px;
        width:10px;
        padding:10px;
        line-height:1.2
        i{
            font-size:16px;
        }
    }
    .btns{
        width:100%;
        position:fixed;
        bottom:0;
        height:50px;
        box-shadow: 0 -5px 10px rgba(0,0,0,0.1);
        display:flex;
        justify-content: space-around;
        align-items: center;
        background-color:#fff;
        flex-wrap:nowrap;
        overflow-x:scroll;
        box-sizing:border-box;
        &.no-space{
            justify-content: unset;
        }
        
    }
}
</style>