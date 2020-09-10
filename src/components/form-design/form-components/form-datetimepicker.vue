<template>
<section class="cell-field" v-if='item.show!==false' v-bind="styClassAttr">
    <div class="cell-title" :class="{required:item.require}">
        <span class="cell-text">{{item.label}}</span>
    </div>
    <div class="cell-value">
        <template>
            <input type="text" v-model='inputValue' @click="openPicker" v-bind="{...localAttr,...attrs}"  readonly :data-key='item.key' @focus="focus" ref="formInput">
            <div class="mint-field-clear" style="" v-if='!item.disableClear&&inputValue' @click='inputValue=""'>
                <i class="mintui mintui-field-error"></i>
            </div>
            <p class="error-info">{{errorInfo}}</p>
            <div @touchmove.prevent>
                <mt-datetime-picker ref="picker" v-if='pickerType!=="time"'
                     v-model='currentDate'
                    :type="pickerType" 
                    :startDate='startData'
                    :endDate='endData'
                    @confirm="handleConfirm"
                ></mt-datetime-picker>
                 <mt-datetime-picker ref="pickerTime" v-else-if='pickerType=="time"'
                    type="time" 
                    v-model='currentTime'
                    @confirm="handleConfirm"
                ></mt-datetime-picker>
            </div>
        </template>
    </div>
</section>
</template>

<script>
import moment from 'moment'
import {DatetimePicker} from 'mint-ui'
import {isEmpty} from '@/utils/index.js'
export default {
    name:'form-datetimepicker',
    components:{
        [DatetimePicker.name]:DatetimePicker,
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
        "item.pickerType":{
            handler(v){
                this.pickerType=v
                if(this.$refs.picker){
                    this.$refs.picker.close()
                }
                if(this.$refs.pickerTime){
                    this.$refs.pickerTime.close()
                }
            },
            immediate:true,
        },
        "item.formatStr":{
            handler(v){
                this.formatStr=v
            },
            immediate:true,
        },
        inputValue:{
            handler(val){
                if(this.item.require&&isEmpty(val)){
                    this.errorInfo='请输入'+this.item.label
                    return
                }
                else{
                    this.errorInfo=''
                }
            }
        },
        "item.startDate":{
            handler(v){
                if(v){
                    this.startData = new Date(v)
                }
                else{
                    this.startData = undefined
                }
            },
            immediate:true,
        },
        "item.endDate":{
            handler(v){
                if(v){
                    this.endData = new Date(v)
                }
                else{
                    this.endData = undefined
                }
            },
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
    },
    data(){
        return {
            inputValue:this.value,
            startData:this.item.startDate?new Date(this.item.startDate):undefined,//默认十年前的1月1日
            endData:this.item.endData?new Date(this.item.endData):undefined,//默认十年后的12-31日
            pickerType:this.item.pickerType?this.item.pickerType:'date',//'datetime', 'date', 'time'
            formatStr:this.item.formatStr?this.item.formatStr:'YYYY-MM-DD',
            errorInfo:'',
            currentTime:'00:00',
            currentDate:(new Date),
            attrs:{},
            localAttr:{},
            styClassAttr:{}
        }
    },
    mounted(){
        
    },
    methods: {
      openPicker() {
        if(this.pickerType!=='time'){
            this.$refs.picker.open();
        }
        else{
            this.$refs.pickerTime.open();
        }
      },
      handleConfirm(val){
        if(this.pickerType!='time'){
            let formatStr=this.pickerType==='date'?'YYYY-MM-DD':'YYYY-MM-DD HH:mm'
            if(this.item.formatStr){
                formatStr=this.item.formatStr
            }
            this.inputValue=moment(val).format(formatStr)
        }
        else if (this.pickerType==='time'){
           this.inputValue=val
        }
      },
        //解决部分ios的readonly无效问题
        focus(){
            this.$refs['formInput'].blur()
        }
    }
  };
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
// .mint-datetime{
//     width:355px;
// }
// .mint-popup-bottom{
//     left:45%;
// }
</style>