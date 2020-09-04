<template>
    <section class="cell-field" v-if='item.show!==false'>
        <div class="cell-title" :class="{required:item.require}">
            <span class="cell-text">{{item.label}}</span>
        </div>
        <div class="cell-value">
            <template>
                <input type="text" v-model='showValue' @click="popupVisible=true" v-bind="attrs" readonly v-on="listeners" :data-key='item.key' @focus="focus" ref="formInput">
                <div class="mint-field-clear" style="" v-if='!item.disableClear&&showValue' @click='showValue=""'>
                    <i class="mintui mintui-field-error"></i>
                </div>
                <input type="hidden" v-model='realValue'>
            </template>
        </div>
        <p class="error-info">{{errorInfo}}</p>
        <div>
            <mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal='false' :modal='false'>
                <div class="search-content">
                    <el-input v-if='item.showSearchInput!==false' :placeholder='item.searchPlaceHolder?item.searchPlaceHolder:"输入关键字搜索"'
                     v-model="searchStr" :clearable="true">
                        <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
                    </el-input>
                    <div class="list" :class='{chooseMutiple:item.chooseMutiple,notContainSearch:item.showSearchInput==false}'
                      
                        >
                            <template v-if='item.chooseMutiple'>
                                <el-checkbox v-for='(it,i) of list' v-model='it.checked' :key='i' >
                                    <p class="txt main">{{it[labelKey]}}</p>
                                    <p class="txt label" v-if='item.labelKey1'>{{it[item.labelKey1]}}</p>
                                    <p class='txt label' v-if='item.labelKey2'>{{it[item.labelKey2]}}</p>
                                </el-checkbox>
                            </template>
                            <template v-else>
                                <div v-for="(it,i) in list" :key='i' @click='confirmPop(it)' class="cell">
                                    <p class="txt main">{{it[labelKey]}}</p>
                                    <p class="txt label" v-if='item.labelKey1'>{{it[item.labelKey1]}}</p>
                                    <p class='txt label' v-if='item.labelKey2'>{{it[item.labelKey2]}}</p>
                                </div>
                            </template>
                            <div class="tip-txt" v-if='!loading&&(!list||!list.length)'>
                                <p v-if='searchStr'>没有找到相关数据</p>
                                <p v-else>输入关键字搜索</p>
                            </div>
                    </div>
                    <div class="select-items" v-if='item.chooseMutiple&&selectItems.length'>
                        <el-tag v-for="(item,i) in selectItems" :key="i" closable style='margin-right:5px' @close='item.checked=false' effect="plain">
                            {{item[labelKey]}}
                        </el-tag>
                    </div>
                    <div class='btns' >
                        <mt-button type="primary" v-if='item.chooseMutiple'  @click="confirmPop" style='margin-right:10px'>确认</mt-button>
                        <mt-button type="default" @click='popupVisible=false'>取消</mt-button>
                    </div>
                </div>
            </mt-popup>
        </div>
    </section>
</template>
<script>
import {Tag,Checkbox,Input, Button as ButtonEle} from 'element-ui'
import {Popup,Button,InfiniteScroll ,Indicator} from 'mint-ui'
import {isEmpty} from '@/utils/index.js'
import Vue from 'vue'
Vue.use(InfiniteScroll);
export default {
    components:{
        [Tag.name]:Tag,
        [Popup.name]:Popup,
        [Button.name]:Button,
        [Checkbox.name]:Checkbox,
        [ButtonEle.name]:ButtonEle,
        [Input.name]:Input
    },
    props:{
        item:{
            type:Object,
            default(){
                return {}
            }
        },
    },
    watch:{
        "item.value":{
            handler(val){
                if(typeof val ==='object'&&val.hasOwnProperty('value')&&val.hasOwnProperty('showValue')){
                    this.realValue=val.value
                    this.showValue=val.showValue
                    this.item.showValue=this.showValue
                }
                else{
                    this.realValue=val
                    this.showValue=val
                    this.item.showValue=this.showValue
                }
                if(this.realValue&&this.item.chooseMutiple){
                    this.selectValuesInit=this.realValue.split(',')
                }
            },
            deep:true,
            immediate:true,
        },
        "item.options":{
            handler(v){
                this.init(v)
            },
            immediate:true
        },
        realValue:{
            handler(val){
                let res=val
                if(val!==this.showValue&&this.showValue){
                    res = {value:val,showValue:this.showValue}
                }
                this.$emit('input',res)
            },
            immediate:true,
        },
        showValue(val){
            if(!val){
                this.realValue=''
                this.allList.forEach(it=>{
                   it.checked=false
                })
                delete this.item.selectItems
            }
            if(this.item.require&&isEmpty(val)){
                this.errorInfo='请选择'+this.item.label
               // this.$emit('input',val)
                return
            }
            else{
                this.errorInfo=''
            }
        },
        popupVisible(v){
            if(v){
                document.body.classList.add('overflow-hidden')
                // if(!this.firstLoad)return
                this.init(this.item.options)
            }
            else{
                document.body.classList.remove('overflow-hidden')
            }
        },
        dataSourceList:{
            handler(val){
                this.list=val.map(it=>{
                    let newIt=JSON.parse(JSON.stringify(it))
                    if(typeof it ==='object'){
                        this.labelKey=this.item.labelKey?this.item.labelKey:'label'
                        this.valueKey=this.item.valueKey?this.item.valueKey:'value'
                        if(this.selectValuesInit&&this.selectValuesInit.indexOf(newIt[this.valueKey])>-1){
                            this.$set(newIt,"checked",true)
                        }
                        else{
                           this.$set(newIt,"checked",false)
                        }
                    }
                    else{//非对象则直接给值
                        newIt={}
                        newIt[this.labelKey]=it
                        newIt[this.valueKey]=it
                    }
                    return newIt
                })
                this.list.forEach((it)=>{
                    let hasItem = this.allList.find(item=>item[this.valueKey]==it[this.valueKey])
                    if(!hasItem){
                        this.allList.push(it)
                    }
                    else{
                        let index = this.allList.indexOf(hasItem)
                        this.allList.splice(index,1,it)
                    }
                })
            },
            deep:true,
            immediate:true,
        },
        searchStr(){
            this.debounce(this.search,500)()
        },
        "item.resetOptions":{
            handler(opts){
                if(opts){
                    this.init(opts)
                }
            },
            deep:true
        },
        "item.attributes":{
            handler(attributes){
                this.attrs={}
                if(Array.isArray(attributes)){
                    attributes.forEach(at=>{
                        if(at.name){
                            this.attrs[at.name]=at.value
                        }
                    })
                }
            },
            immediate:true,
        },
    },
    data(){
        return {
            popupVisible:false,
            errorInfo:'',
            showValue:'',
            realValue:'',
            list:[],
            allList:[],
            dataSourceList:[],
            searchStr:'',
            loading:false,
            labelKey:'label',
            valueKey:'value',
            firstLoad:true,
            selectValuesInit:[],
            isBusy:false,
            hasMoreData:true,
            pageIndex:1,
            pageSize:this.item.pageSize?this.item.pageSize:20,
            func:"",
            searchFunc:"",
            attrs:[]
            
        }
    },
    methods:{
        init(opt){
            // let opt = this.item.options
            if(opt){
                if(Array.isArray(opt)){
                    this.isBusy=true//不需要触发下拉事件
                    this.dataSourceList=opt
                    this.firstLoad=false
                }
                else {
                    if(typeof opt ==='function'){
                        this.func=opt
                    }
                    else if(typeof opt === "string" && typeof window[opt]==='function'){
                        this.func=window[opt]
                    }
                    if(typeof this.func === 'function'){
                        if(this.item.pagenble){
                            this.getPageData()
                        }
                        else{
                            this.isBusy=true//不需要触发下拉事件
                            this.loading=true
                            Indicator.open()
                            this.func((res)=>{
                                this.firstLoad=false
                                this.dataSourceList=res
                                this.loading=false
                                setTimeout(() => {
                                    Indicator.close()
                                },0);
                            },{searchStr:this.searchStr})
                        }
                    }
                }
            }
        },
        // 防抖
        debounce(fn, wait) {    
            let self=this 
            return function() {        
                if(self.timerId !== null) clearTimeout(self.timerId);        
                self.timerId = setTimeout(fn, wait);    
            }
        },
        search(){
            if(typeof this.item.searchFunc == 'function'){
                this.searchFunc= this.item.searchFunc
            }
            else if(typeof this.item.searchFunc=='string'&&typeof window[this.item.searchFunc] =='function'){
                this.searchFunc= window[this.item.searchFunc]
            }
            if(typeof this.searchFunc =='function'){
                if(!this.item.pagenble){
                    this.isBusy=true//不需要触发下拉事件
                    this.loading=true
                    Indicator.open()
                    this.searchFunc(res=>{
                        this.selectValuesInit=JSON.parse(JSON.stringify(this.selectValues))
                        this.dataSourceList=res
                        this.loading=false
                        setTimeout(() => {
                            Indicator.close()
                        },0);
                    },{searchStr:this.searchStr})
                }
                else{
                    this.getPageData(true)
                }
            }
        },
        confirmPop(selectItem){
            if(!this.item.chooseMutiple){
                this.showValue=selectItem[this.labelKey]
                this.item.showValue=selectItem[this.labelKey]
                this.realValue=selectItem[this.valueKey]
                //为callback时提供整个对象
                this.forCallbackSelectItems(selectItem)
            }
            else{
                if(this.selectValues){
                    this.realValue=this.selectValues.join(',')
                    this.showValue=this.selectItems.map(it=>it[this.labelKey]).join(',')
                    this.item.showValue=this.showValue
                    //为callback时提供整个对象
                    this.forCallbackSelectItems(this.selectItems)
                }
            }
            this.popupVisible=false
        },
        //为callback时提供整个对象
        forCallbackSelectItems(selectItems){
            if(!this.item.chooseMutiple){
                selectItems=[selectItems]
            }
            let its=JSON.parse(JSON.stringify(selectItems))
            its.forEach(it=>{
                delete it.checked
            })
            //区分是多选还是单选
            if(!this.item.chooseMutiple){
                this.item.selectItems=its[0]
            }
            else{
                this.item.selectItems=its
            }
        },
        getPageData(isFromSearch){
            this.pageIndex=1
            this.list=[]
            this.hasMoreData=true
            this.isBusy=false
            this.loadMore(isFromSearch)
        },
        loadMore(isFromSearch){
            if(!this.item.pagenble)return
            if(!this.hasMoreData)return
            if(this.isBusy)return
            this.isBusy=true
            this.loading=true
            Indicator.open();
            let callBackFun=res=>{
                //第一次加载数据时，因为还没数据，没有selectValues，所以不能覆盖默认值
                if(!this.firstLoad){
                    this.selectValuesInit=JSON.parse(JSON.stringify(this.selectValues))
                }
                this.firstLoad=false
                if(this.pageIndex==1){
                    this.dataSourceList=res
                }
                else{
                    this.dataSourceList.push(...res)
                }
                if(res.length<this.pageSize){
                    this.hasMoreData=false
                    this.isBusy=true
                }
                else{
                    this.pageIndex++
                    this.isBusy=false
                }
                this.loading=false
                setTimeout(() => {
                    Indicator.close()
                },0);
            }
            let payload={searchStr:this.searchStr,pageIndex:this.pageIndex,pageSize:this.pageSize}
            if(isFromSearch){
                this.searchFunc(callBackFun,payload)
            }
            else{
                this.func(callBackFun,payload)
            }
        },
        //解决部分ios的readonly无效问题
        focus(){
            this.$refs['formInput'].blur()
        }
    },
    computed: {
        selectValues(){
            let res = this.allList.filter(it=>it.checked).map(it=>it[this.valueKey])
            return res
        },
        selectItems(){
            return this.allList.filter(it=>it.checked)
        },
        listeners: function () {
            var vm = this
            return Object.assign({},
                this.$listeners,
                {
                    input: function (event) {
                        //vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },
    activated(){  // keep-alive 组件激活时使用
        this.isBusy = false
    },
    deactivated () {  // keep-alive 组件停用时使用
        this.isBusy = true  
        document.body.classList.remove('overflow-hidden')
    },
}
</script>
<style>
.overflow-hidden{
    overflow:hidden
}
.hips-indicator{
    position:fixed !important;
}
</style>
<style scoped lang='scss'>
@import  'form-common.scss';

.search-content{
    width:330px;
    height:580px;
    padding:15px;
    box-sizing: border-box;
    position:relative;
    .list{
        overflow: scroll;
        margin-top:10px;
        height: calc(100% - 130px);
        &.chooseMutiple{
            height :calc(100% - 130px - 40px);
        }
        &.notContainSearch{
            height: calc(100% - 85px);
            &.chooseMutiple{
                height :calc(100% - 85px -40px)
            }
        }
        padding-top:80px;
        overflow-y:scroll;
        box-sizing: border-box;
        // display: flex;
        // flex-direction: column;
        padding: 5px 10px;
        .el-checkbox{
            height: auto;
            padding:5px 0;
            display:flex;
            align-items:center;
            margin-right:0;
            &:first-child{
                border-top:1px solid #d9d9d9;
            }
            border-bottom:1px solid #d9d9d9;
            .el-checkbox__label{
                margin-left:10px;
                padding:5px 0;
                height:auto;
                // display:flex;
                // flex-direction column;
                // justify-content space-between;
                width: 320px;
                word-break: break-all;
            }
        }
        .cell{
            padding:5px 0;
            height: auto;
            // display:flex;
            // flex-direction:column;
            // justify-content space-between;
            word-break: break-all;
            &:first-child{
                border-top:1px solid #d9d9d9;
            }
            border-bottom:1px solid #d9d9d9;
        }
        p.txt{
            white-space: pre-wrap;
            padding:2px 0;
        }
        .main{
            font-size:17px;
            font-weight: 500;
            color:#333;
            line-height:1.5;
        }
        .label{
            font-size:12px;
            color: #999;
        }
        .tip-txt{
            text-align: center;
        }
    }
    .select-items{
        display:flex;
        width:100%;
        overflow-x :scroll;
        margin-top:10px;
    }
    .btns{
        position:absolute;
        right:0;
        left:0;
        bottom:15px;
        margin-top:10px;
        text-align:center;
        .mint-button{
            font-size: 14px;
            height: 30px;
            &.mint-button--default{
                border:1px solid #999;
            }
        }
    }
}
</style>