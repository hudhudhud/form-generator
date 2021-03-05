
<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <!-- <el-button icon="el-icon-view" type="text" @click="goPreview">
            预览（测试环境）
          </el-button> -->
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
                  <!-- <svg-icon :icon-class="element.__config__.type" /> -->
                  <span v-if='element.__config__.type=="hidden"'>hidden组件</span>
                  <span v-else-if='element.__config__.type=="detail"'>
                    {{element.modeType}}
                  </span>
                  <span v-else>{{element.__config__.label}}</span>
                  <span v-if="element.tip" style='font-size:10px;color:red;display:block;'>({{element.tip}})</span>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar"> <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
        <el-button icon="el-icon-check" type="text" @click="confirmJson">
          保存
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showCss">
          查看css
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJs">
         查看js
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
      </div>
    
      <div class="center-scrollbar">
        <div class="phone">
          <el-row class="center-board-row" :gutter="formConf.gutter">
              <el-form
              @submit.native.prevent
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
            > 
              <el-scrollbar class="form-container">
                <!-- 整体结构展示 -->
                <template>   
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
                    />
                  </draggable>
                </template>
                <div v-show="!drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行表单设计
                </div>
              </el-scrollbar>
            </el-form>
          </el-row>
        </div>
       
      </div>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      :draw-list-obj ="drawingListObj"
      @tag-change="tagChange"
      :onlyComp="true"
    />

    <css-drawer
      size="60%"
      v-model="cssData"
      :visible.sync="cssDrawerVisible"
    />
    <js-drawer
      size="60%"
      v-model="jsData"
      :visible.sync="jsDrawerVisible"
    />
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(allParams)"
      @jsonChange = "jsonChange"
     
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
import JsonDrawer from '@/components/monaco-editor/JsonDrawer'
import JsDrawer from '@/components/monaco-editor/JsDrawer'
import CssDrawer from '@/components/monaco-editor/CssDrawer'
import RightPanel from './RightPanel'
import {
  inputComponents, selectComponents,showComponets,otherComponents, detailComponents,formConf,formFlowConf
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
import {drawingDefalutFlow} from '@/components/generator/drawingDefalut'
import initDrawing from '@/components/generator/initDrawing'
import logo from '@/assets/logo.png'
import DraggableItem from './DraggableItem'
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'
import loadBeautifier from '@/utils/loadBeautifier'
import Popup from '@/components/popup'
import {GET_JSON,SAVE_JSON,GET_JSON_PUBLIC,SAVE_JSON_PUBLIC} from '@/utils/api'
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
    JsonDrawer,
    JsDrawer,
    CssDrawer,
    RightPanel,
    DraggableItem,
    Popup
  },
  data() {
    return {
      allParams:[],
      jsData:'',
      cssData:'',
      systemid:'',
      activeModuleIndex:0,
      initDrawing:initDrawing,
      showDescPop:false,
      logo,
      idGlobal,
      formConf:formConf,
      inputComponents,
      selectComponents,
      otherComponents,
      detailComponents,
      labelWidth: 100,
      drawingList: [],//drawingDefalut,
      drawingListObj:{},
      drawingData: {},
      activeId: '',//drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      jsDrawerVisible:false,
      cssDrawerVisible:false,
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
        {
          title: '显示型组件',
          list: showComponets
        },
        {
          title:'明细组件',
          list:detailComponents,
        },
        {
          title: '其他组件',
          list: otherComponents.slice(0,otherComponents.length-1)
        },
      ]
    }
  },
  computed: {
  },
  watch: {
    drawingListObj:{
      handler(val){
        this.drawingList = val.list
      },
      deep:true
    },
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
          let res =  await Request.post(GET_JSON_PUBLIC,{orunid:this.$route.query.orunid})
          this.initDrawing = res.htmlJson
          this.cssData = res.css
          this.jsData = res.js
          this.systemid = res.systemid
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

    this.initJsonData()
  },
  methods: {
    initJsonData(){
    if(this.initDrawing&&Array.isArray(this.initDrawing)){
        this.initDrawing.forEach((param,i)=>{
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
        this.drawingList.forEach(it=>{this.createIdAndKey(it)})
        
        Object.keys(this.initDrawing).forEach((key,i)=>{
          if(key!=='params'&&key!=='modules'){
            this.$set(this.formConf,key,this.initDrawing[key])
          }
        })
        //移除删除的json字段
        Object.keys(this.formConf).forEach((key,i)=>{
          if(!(key in this.initDrawing)){
            delete this.formConf[key]
          }
        })
      }
      else{
        //新建配置默认
        this.drawingList = drawingDefalut
        this.activeId=100
      }

      this.drawingListObj={list:this.drawingList}

        //默认选中第一项
        this.activeFormItem(this.drawingList[0])

        loadBeautifier(btf => {
            beautifier = btf
        })
    },
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
      if(!currentItem)return
      this.activeData = currentItem
      this.activeId = currentItem.__config__.formId
    },
    activeModuleItem(index){
      this.activeModuleIndex = index
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
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      // if (config.layout === 'colFormItem') {
      //   item.__vModel__ = `field${this.idGlobal}`
      // } else if (config.layout === 'rowFormItem') {
      //   config.componentName = `row${this.idGlobal}`
      //   !Array.isArray(config.params) && (config.params = [])
      //   delete config.label // rowFormItem无需配置label属性
      // }
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
              delete item.componentName
            })
          }
        }) 
        this.allParams = resultList
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
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          // this.formConf={}
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
    showJs(){
      this.jsDrawerVisible = true
    },
    showCss(){
      this.cssDrawerVisible = true
    },
    async confirmJson(){
      this.AssembleFormData()
      let jsonString = JSON.stringify(this.allParams)
      let beautifierJson = beautifier.js(jsonString, beautifierConf.js)
      let beautifierCss = this.cssData// beautifier.js(this.cssData, beautifierConf.js)
      let beautifierJs =  beautifier.js(this.jsData, beautifierConf.js)
      console.log('formJson...',beautifierJson)
      // window.parent.parentSetJson(beautifierJson); 
      // window.parent.postMessage(beautifierJson, '*')
      //构造流程引擎json
      // let readJson = ''
      // if(this.formConf.syncToWorkFlow){
      //   readJson =  this.buildReadJson(beautifierJson)
      //   //return 
      // }
      if(!this.$route.query.orunid){
        Toast({ message:'保存失败，缺少orunid参数！', position:'middle', duration:3000 })
        return
      }

      try{
          let res = await Request.post(SAVE_JSON_PUBLIC,{orunid:this.$route.query.orunid,
            formJson:beautifierJson,systemid:this.systemid,css:beautifierCss,js:beautifierJs})
          if(res.code==0){
            this.$message({ message: '保存成功！', type: 'success' });
          }
          else{
            Toast({ message:res.msg, position:'middle', duration:3000 })
          }
        }
        catch(e){
          console.log(e)
          Toast({  message:e, position:'middle', duration:3000 })
        }
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
    jsonChange(newjson){
      // console.log('jsonChange',newjson)
      this.drawingList = []
      this.initDrawing = newjson 
      this.initJsonData()
    },
    goPreview(){
      let a = document.createElement('a')
      a.setAttribute('target','_blank')
    a.href = "http://mobileproxy.h3c.com:8000/dev/work-flow/#/workflow-form/"+this.$route.query.orunid
      a.click()
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
    background-position-y:10px;
    height: calc(100% - 50px);
    padding: 100px 16px 0 16px;
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
      background-color:#fff;
       //position:fixed元素滚动时需要固定位置，因此增加相对定位容器
      .form-container{
        padding-top:10px;
        position:relative;
        width:100%;
        height:100%;
        // overflow: auto;
        box-sizing: border-box;
         &.show{
          padding-bottom:60px;
        }
      }
      .actived{
        // border:1px solid red;
      }
      ::v-deep.active-from-item{
        border: 1px dashed red !important;//$lighterBlue;
      }
      ::v-deep.el-scrollbar__view{
        height:100%;
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
<style lang='scss'>
.el-collapse-item{
    padding:10px;
    box-sizing:border-box;
}
.active-el-collapse{
  border:1px dashed blue;
}
.el-collapse-item__header{
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight:bold;
    background-color:#E5E3E0;
    border-radius:5px;
}
.el-collapse-item__wrap{
  padding-top:10px;
}
.el-collapse-item__content{
    padding-bottom:0px;
    .cell-field:first-child{
        border-top:none;
    }
}
</style>