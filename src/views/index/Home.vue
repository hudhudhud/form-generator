
<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <el-button icon="el-icon-view" type="text" @click="goPreview">
            预览（测试环境）
          </el-button>
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
      <div class="action-bar">
        <!-- <div style='display:inline-block;font-size:13px;margin-right:10px' v-if="!isFlow">同步到流程引擎 <el-switch v-model="formConf.syncToWorkFlow" /></div> -->
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
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
              <el-scrollbar class="form-container"  :class="{'show':(Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length)||isFlow,'module-bkg':formConf.showAsModule}">
                 <div v-if='formConf.descHtml' v-html='formConf.descHtml' class="desc-html">
                </div>
                <!-- 整体结构展示 -->
                <template v-if='!formConf.showAsModule'>   
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
                <!-- 模块结构展示 -->
                <template v-else>
                  <template v-for='(moduleItem,i) in drawingList'>
                     <el-collapse v-if='moduleItem.module' :key='i' v-model='activeNames'>
                      <el-collapse-item :title="moduleItem.module" :name="moduleItem.module" 
                       :class="{[moduleItem.class]:true,'active-el-collapse':activeModuleIndex==i}" 
                      @click.native='activeModuleItem(i)'>
                        <template slot="title">
                            <div class="collapse-title">
                              <img :src="moduleImg.find(it=>it.imgName==moduleItem.img).img" alt="" v-if="moduleItem.img&&moduleImg.find(it=>it.imgName==moduleItem.img)">
                              <span>{{moduleItem.module}}</span>
                            </div>
                        </template>
                         <draggable class="drawing-board" :list="moduleItem.params" :animation="340" group="componentsGroup">
                            <draggable-item
                              v-for="(item, index) in moduleItem.params"
                              :key="item.renderKey"
                              :drawing-list="moduleItem.params"
                              :current-item="item"
                              :index="index"
                              :active-id="activeId"
                              :form-conf="formConf"
                              @activeItem="activeFormItem($event,index)"
                              @copyItem="drawingItemCopy"
                              @deleteItem="drawingItemDelete"
                            />
                        </draggable>
                      </el-collapse-item>
                     </el-collapse>
                      <draggable class="drawing-board" v-else :list="moduleItem.params" :animation="340" group="componentsGroup" :key='i'>
                          <draggable-item
                            v-for="(item, index) in moduleItem.params"
                            :key="item.renderKey"
                            :drawing-list="moduleItem.params"
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
                </template>
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
                <!-- 新建表单按钮 -->
                <div class="btns"   @click="btnClick"
                  v-if='!isFlow&&Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length'
                  :class="{'no-space':Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length>2}">
                    <el-button plain class='bottom-btn-pre' icon="el-icon-back">返回</el-button>
                    <el-button plain class='bottom-btn-pre' icon="el-icon-check">提交</el-button>
                    <template v-for='(btn,i) of formConf.customerBtns' >
                        <el-button  plain class='bottom-btn-pre'  :style='btn.style' :key='i' :icon="btn.icon">{{btn.title}} </el-button> 
                    </template>
                </div> 
                <!-- 流程审批按钮 -->
                <div class="btns" v-if="isFlow" :class="{'no-space':Array.isArray(formConf.customerBtns)&&formConf.customerBtns.length>2}" @click="btnClick">
                  <!-- 同意 -->
                  <template v-if="formConf.fixBtns&&formConf.fixBtns.agree">
                      <el-button plain class='bottom-btn'  v-if="formConf.fixBtns.agree.show" >
                        <img src="../../assets/approve-agree.png" />
                        <span>{{formConf.fixBtns.agree.title}}</span>
                      </el-button>
                  </template>
                  <el-button plain class='bottom-btn' v-else >
                    <img src="../../assets/approve-agree.png" />
                    <span>同意</span>
                  </el-button>
                  <!-- 驳回 -->
                  <template v-if="formConf.fixBtns&&formConf.fixBtns.refuse">
                      <el-button plain class='bottom-btn' v-if="formConf.fixBtns.refuse.show">
                        <img src="../../assets/approve-refuse.png" />
                        <span>{{formConf.fixBtns.refuse.title}}</span>
                      </el-button>
                  </template>
                  <el-button plain class='bottom-btn'  v-else>
                    <img src="../../assets/approve-refuse.png" />
                    <span>驳回</span>
                  </el-button>
                  <!-- 转办 -->
                  <template v-if="formConf.fixBtns&&formConf.fixBtns.transfer">
                      <el-button plain class='bottom-btn'  v-if="formConf.fixBtns.transfer.show">
                        <img src="../../assets/transmit-icon.png" />
                        <span>{{formConf.fixBtns.transfer.title}}</span>
                      </el-button>
                  </template>
                  <el-button plain class='bottom-btn' v-else>
                     <img src="../../assets/transmit-icon.png" />
                     <span>转办</span>
                  </el-button>
                  <!-- 自定义按钮 -->
                  <template v-for='(btn,i) of formConf.customerBtns' >
                      <el-button plain class='bottom-btn' :style='btn.style' :key='i' :icon="btn.icon">{{btn.title}} </el-button> 
                  </template>
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
      :toFormTab = toFormTab
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
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
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
import {GET_JSON,SAVE_JSON} from '@/utils/api'
import Request from '@/utils/request'
import {Toast} from 'mint-ui'
import {moduleImg} from '@/utils/common'
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
      moduleImg,
      toFormTab:'',
      jsData:'',
      cssData:'',
      systemid:'',
      activeModuleIndex:0,
      initDrawing:initDrawing,
      showDescPop:false,
      logo,
      idGlobal,
      formConf:this.isFlow?formFlowConf:formConf,
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
          list: otherComponents
        },
      ]
    }
  },
  computed: {
    isFlow(){
      return this.$route.name=='flow'
    },
    activeNames: {
      get: function() {
        let res = []
        if(this.formConf.showAsModule){
          res = this.drawingList.filter(it=>it.active).map(it=>it.module)
        }
        return res
      },
      set: function() {}
    }
    // drawingListObj(){
    //   return {list:this.drawingList}
    // }
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
          let res =  await Request.post(GET_JSON,{orunid:this.$route.query.orunid})
          this.initDrawing = res.htmlJson
          this.cssData = res.css
          this.jsData = res.js
          this.systemid = res.systemid
          sessionStorage.setItem('systemid',res.systemid)
          if(this.initDrawing.modules){
            this.$set(this.formConf,"showAsModule",true)
          }
          else{
            this.$set(this.formConf,"showAsModule",false)
          }
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
      //流程配置默认
      if(this.isFlow&&(!this.initDrawing||!Object.keys(this.initDrawing).length)){
        this.initDrawing = drawingDefalutFlow
      }
      if(this.initDrawing&&Object.keys(this.initDrawing).length){
        if(Array.isArray(this.initDrawing['params'])){
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
          this.drawingList.forEach(it=>{this.createIdAndKey(it)})
        }
        else if(Array.isArray(this.initDrawing['modules'])){
          this.initDrawing["modules"].forEach((moduleItem,i)=>{
            let paramsList = []
            moduleItem['params'].forEach((param,i)=>{
              if(param.type!=='detail'){
                //非明细
                let res = this.settingInitJson(param)
                paramsList.push(res)
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
                paramsList.push({__config__:{...obj},layout:'rowFormItem'})
              }
            })
            paramsList.forEach(it=>{this.createIdAndKey(it)})
            this.drawingList.push({module:moduleItem.module,active:moduleItem.active,img:moduleItem.img,class:moduleItem.class,params:paramsList,
            // key:moduleItem.key,
            show:moduleItem.show===undefined?true:moduleItem.show})
          })
        }
        
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
      if(!this.formConf.showAsModule){
        this.activeFormItem(this.drawingList[0])
      }
      else{
        this.activeModuleIndex=0
        if(this.drawingList.length&&this.drawingList[0].params.length){
          this.activeFormItem(this.drawingList[0].params[0])
        }
      }
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
      this.toFormTab = 'field'
    },
    activeModuleItem(index){
      this.activeModuleIndex = index
      this.toFormTab = 'form'
      this.$nextTick(()=>{
        document.querySelectorAll('.el-scrollbar__wrap')[3].scrollTo(0,10000)
      })
    },
    btnClick(){
      this.toFormTab = 'form'
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
        if(!this.formConf.showAsModule){
          this.drawingList.push(clone)
          this.activeFormItem(clone)
        }
        else{
          if(!Array.isArray(this.drawingList[this.activeModuleIndex].params)){
            this.drawingList[this.activeModuleIndex].params=[]
          }
          this.drawingList[this.activeModuleIndex].params.push(clone)
        }
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
      if(!this.formConf.showAsModule){
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
        // console.log(3333,resultList)     
        this.formData = {
          params: resultList,
          ...this.formConf
        }
      }
      else{
        let resultList =[]
        this.drawingList.forEach(moduleItem=>{
           let obj = deepClone(moduleItem)
           if(!Array.isArray(obj.params)){
             obj.params = []
           }
           let params = obj.params.map(item=>item.__config__)
           params.forEach(it=>{
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
           obj.params = params
           resultList.push(obj)
        })
        this.formData = {
          modules: resultList,
          ...this.formConf
        }
        console.log(1111111,this.formData)
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
          if(!this.formConf.showAsModule){
            this.activeFormItem(this.drawingList[len - 1])
          }
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
      let jsonString = JSON.stringify(this.formData)
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
          let res =  await Request.post(SAVE_JSON,{orunid:this.$route.query.orunid,
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
    //构造流程引擎json
    buildReadJson(beautifierJson){
      let json = JSON.parse(beautifierJson)
      let resAry = []
      if(this.formConf.showAsModule){
        if(Array.isArray(json.modules)&&json.modules.length){
          json.modules.forEach((moduleItem,index)=>{
            let ary = []
            let obj = {
              "groupIndex":index,
              "groupLabel":moduleItem.module?moduleItem.module:'其他信息',
              "groupType":"1",
              "details":[ary]
            }
            if(Array.isArray(moduleItem.params)&&moduleItem.params.length){
              moduleItem.params.forEach(it=>{
                if(['hidden','html','fileUpload',"detail"].indexOf(it.type)==-1){
                  ary.push({ "label":it.label,"value":it.key})
                }
              })
            }
            resAry.push(obj)
          })
        }
      }
      else{
        let ary = []
        let obj = {
          "groupIndex":0,
          "groupLabel":"详细信息",
          "groupType":"1",
          "details":[ary]
        }
        if(Array.isArray(json.params)&&json.params.length){
          json.params.forEach(it=>{
            if(['hidden','html','fileUpload',"detail"].indexOf(it.type)==-1){
              ary.push({ "label":it.label,"value":it.key})
            }
          })
        }
        resAry.push(obj)
      }
      let readJson=beautifier.js(JSON.stringify(resAry), beautifierConf.js)
      console.log("readJson...",readJson)
      return readJson
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
      // if(!this.formConf.showAsModule){
      //   this.drawingList = deepClone(data.params)
      //   delete data.params
      //   this.formConf = data
      // }
      // else{
      //   this.drawingList = deepClone(data)
      //   delete data.modules
      //   this.formConf = data
      // }
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
      if(this.isFlow){
        a.href = "http://mobileproxy.h3c.com:8000/dev/work-flow/#/workflow-detail-form?orunid="+this.$route.query.orunid
      }
      else{
        a.href = "http://mobileproxy.h3c.com:8000/dev/work-flow/#/workflow-form/"+this.$route.query.orunid
      }
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
        &.module-bkg{
          background-color:#F4F5F8
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
.collapse-title{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    i,img{ margin-right:10px;width:15px;height:15px;}
}
</style>
<style lang='scss'>
.bottom-btn-pre{
  border:none;
}
 .bottom-btn{
  border:none;
  >span{
    display:flex;
    align-items:center;
  }
  img{
    width:20px;
    height:18px; 
    margin-right:10px;
  }  
}
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
    background-color:#FEFFFE;
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