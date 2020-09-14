<template>
    <section class="cell-field" v-if='item.show!==false' v-bind="styClassAttr">
        <div class="cell-title" :class="{required:item.require}">
            <span class="cell-text">{{item.label}}</span>
        </div>
        <div class="cell-value">
            <template>
                <input type="text" v-model='showValue' @click="popupVisible=true" v-bind="{...localAttr,...attrs}" readonly v-on="listeners" :data-key='item.key' @focus="focus" ref="formInput">
                <div class="mint-field-clear" style="" v-if='!item.disableClear&&showValue' @click='showValue=""'>
                    <i class="mintui mintui-field-error"></i>
                </div>
                <input type="hidden" v-model='realValue'>
            </template>
        </div>
        <p class="error-info">{{errorInfo}}</p>
        <div @touchmove.prevent>
            <mt-popup v-model="popupVisible" position="middle" :closeOnClickModal='true'>
            <!-- <section v-show='popupVisible' class="pop-bg"> -->
                <div class="cascader-content pop-content">
                    <div class="select-item" v-for='(opt,i) of item.options' :key='i'>  
                        <span class="label">{{opt.label}}：</span>
                        <select name="" id="" v-model='selectValues[opt.key]' @change='change(opt)'>
                            <option value="" style='display:none'></option><!-- 解决ios第一项选不了 -->
                            <template v-if='dataOrigin[opt.key]'>
                                <option v-for='(it,i) in dataOrigin[opt.key].list' :value='it[item.valueKey]' :key='i'>{{it[item.labelKey]}}</option>
                            </template>
                        </select>
                    </div>
                    <div class='btns'>
                        <mt-button type="primary" @click="confirmPop">确认</mt-button>
                        <mt-button type="default" @click='popupVisible=false'>取消</mt-button>
                    </div>
                </div>
            <!-- </section> -->
            </mt-popup>
        </div>
    </section>
</template>
<script>
import {Popup,Button} from 'mint-ui'
import {isEmpty} from '@/utils/index.js'
export default {
    components:{
        [Popup.name]:Popup,
        [Button.name]:Button,
    },
    props:{
        item:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    watch:{
        "item.value":{
            handler(val,old){
                //val为对象类型
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
                if(this.realValue&&typeof this.realValue == 'string'){
                    this.initValueAry=this.realValue.split(',')
                }
            },
            deep:true,
            immediate:true,
        },
        "item.attributes":{
            handler(attributes){
                this.attrs={}
                if(Array.isArray(attributes)){
                    attributes.forEach(at=>{
                        if(!at.name)return
                        if(at.name=='style'||at.name=='class'){
                            this.styClassAttr[at.name]=at.value
                        }
                        else{
                            this.attrs[at.name]=at.value
                        }
                    })
                }
            },
            immediate:true,
        },
         "item.label":{
            handler(val){
                this.localAttr={placeholder:val?'请输入'+val:''}
            },
            immediate:true,
        },
        realValue:{
            handler(val){
                let res = {value:val,showValue:this.showValue}
                this.$emit('input',res)
            },
            immediate:true,
        },
        showValue(val){
            if(!val){
                this.realValue=''
                delete this.item.selectItems
            }
            if(this.item.require&&isEmpty(val)){
                this.errorInfo='请选择'+this.item.label
               // this.$emit('input','')
                return
            }
            else{
                this.errorInfo=''
            }
        },
        popupVisible(v){
            if(v){
                document.body.style.overflow='hidden'
                if(!this.firstLoad)return
                if(this.item.options&&this.item.options.length){
                    //初始化下拉项对象
                    this.item.options.forEach((opt,i)=>{
                        this.$set(this.dataOrigin,opt.key,{list:[]})
                        this.$set(this.selectValues,opt.key,'')
                    })
                    
                    //初始化加载第一项下拉
                    let firstOpt = this.item.options[0]
                    if(typeof window[firstOpt.func] == "function"){
                        window[firstOpt.func]((res)=>{
                            if(Array.isArray(res)){
                                this.dataOrigin[firstOpt.key].list=[...res]
                            }
                            if(this.initValueAry&&this.initValueAry.length){
                                this.$set(this.selectValues,firstOpt.key,this.initValueAry[0])
                            }
                            this.firstLoad=false
                        })
                    }

                    //初始化其他下拉项
                    this.item.options.forEach((opt,i)=>{
                        if(!isEmpty(this.initValueAry[i])){
                            if(opt.changeKey&&opt.changeFunc&&this.initValueAry[i]){
                                if(typeof window[opt.changeFunc] == "function"){
                                    window[opt.changeFunc]((res)=>{
                                        if(Array.isArray(res)){
                                            this.dataOrigin[opt.changeKey].list=[...res]
                                        }
                                        this.$set(this.selectValues,opt.changeKey,this.initValueAry[i+1]?this.initValueAry[i+1]:'')
                                    },this.initValueAry[i],this.initValueAry.filter(it=>it).join(','))
                                }
                            }
                        }
                    })
                }
            }
            else{
                document.body.style.overflow=''
            }
        }
    },
    data(){
        return {
            popupVisible:false,
            errorInfo:'',
            showValue:'',
            realValue:'',
            dataOrigin:{},
            selectValues:{},
            // emptySelectObj:{"label":'请选择',"value":''},
            firstLoad:true,
            initValueAry:[],
            attrs:{},
            localAttr:{},
            styClassAttr:{}
        }
    },
    methods:{
        confirmPop(){
            if(this.selectValues){
                this.realValue=Object.values(this.selectValues).filter(it=>it).join(',')
                this.calcShowValue()
            }
            this.popupVisible=false
        },
        change(opt){
            let val = event.target.value
            this.selectValues[opt.key]=val
            if(opt.changeKey&&opt.changeFunc){
                //之后的联动值全部置空
                let targetIndex=-1
                Object.keys(this.selectValues).forEach((key,i)=>{
                    if(key==opt.changeKey){
                        targetIndex=i
                    }
                    if(i>=targetIndex&&targetIndex!=-1){
                        this.selectValues[key]=''
                        this.dataOrigin[key].list=[]
                    }
                })
                //end
                this.dataOrigin[opt.changeKey].list=[]
                if(typeof window[opt.changeFunc] == "function"&&val!=''){
                    let values = Object.values(this.selectValues).filter(it=>it).join(',')
                    window[opt.changeFunc]((res)=>{
                        if(Array.isArray(res)){
                            this.dataOrigin[opt.changeKey].list=[...res]
                        }
                    },val,values)
                }
            }
        },
        calcShowValue(){
            let str=[]
            let selectItems=[]
            Object.keys(this.selectValues).forEach(key=>{
                let obj = this.dataOrigin[key].list.find(it=>it[this.item.valueKey]==this.selectValues[key])
                if(obj&&obj[this.item.labelKey]!='请选择'){
                    str.push(obj[this.item.labelKey])
                    selectItems.push(obj)
                }
            })
            this.showValue=str.join(this.item.showValueSplit?this.item.showValueSplit:'')
            this.item.showValue=this.showValue
            //为callback时提供整个对象
            if(selectItems.length){
                this.item.selectItems=JSON.parse(JSON.stringify(selectItems))
            }
        },
        //解决部分ios的readonly无效问题
        focus(){
            this.$refs['formInput'].blur()
        }
    },
    computed: {
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

}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
.mint-popup{
    border-radius:10px;
}
.cascader-content{
    width:320px;
    min-height:150px;
    padding:15px;
    box-sizing:border-box;
    .select-item{
        text-align:center;
        margin-bottom:10px;
        .label{
            font-size:14px;
        }
    }
    select{
        width:200px;
        height:33px;
        padding:5px;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        /*将默认的select选择框样式清除*/
        background: none;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        outline:none;
        font-size:14px;
        color:#000;
    }
    .btns{
        margin-top:10px;
        text-align:center;
        .mint-button{
            font-size: 14px;
            height: 30px;
        }
    }
}
.pop-bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0,0.5);
    z-index:9999;
    .pop-content{
        position:absolute;
        top:50%;
        left:50%;
        transform:translateX(-50%) translateY(-50%);
        background-color:#fff;
        border-radius:5px;
        z-index:10000;
    }
}
</style>