<template>
    <section class="cell-field" v-if='item.show!==false'>
        <div class="cell-title" :class="{required:item.require}">
            <span class="cell-text">{{item.label}}</span>
        </div>
        <div class="cell-value">
            <div :class="{row:direction=='row',column:direction=='column'}">
                <label class="cell-radio-label" v-for='(it,i) of list' :key='i'>
                    <input type="radio" v-bind="$attrs"  :checked='status==it[valueKey]' @change='status=it[valueKey]'
                    class="mint-radio-input" :disabled='item.readonly' :data-key='item.key' :value="it[valueKey]" :data-name='it[labelKey]'> 
                    <span class="mint-radio-core"></span>
                    <span class="mint-radio-label">{{it[labelKey]}}</span>
                </label>
            </div>
        </div>
        <!-- <p class="error-info">{{errorInfo}}</p> -->
    </section>
</template>
<script>
import {isEmpty} from '@/utils/index.js'
export default {
    props:{
        value:"",
        item:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    model:{
        prop:'value',
        event:'input',
    },
    watch:{
        value:{
            handler(val){
                this.status=val
            },
            immediate:true,
        },
        status:{
            handler(val){
                if(this.item.require&&isEmpty(val)){
                    this.errorInfo='请选择'+this.item.label
                    this.item.showValue=''
                    this.$emit('input',val)
                    return
                }
                else{
                    this.errorInfo=''
                    //为callback时提供整个对象
                    this.item.selectItems={}
                    let obj = this.list.find(it=>it[this.valueKey]==val)
                    if(obj){
                        this.item.selectItems=JSON.parse(JSON.stringify(obj))
                    }
                    this.item.showValue=this.item.selectItems[this.labelKey]
                }
                this.$emit('input',val)
            },
            immediate:true,
        },
        "item.options":{
            handler(val){
                this.list=[]
                //判断是值数组还是对象数组
                if(val&&val.length){
                    if(typeof val[0] !== 'object'){
                        val.forEach(it=>{
                            this.list.push({[this.labelKey]:it,[this.valueKey]:it})
                        })
                    }
                    else{
                        if(this.item.labelKey){
                            this.labelKey=this.item.labelKey
                        }
                        if(this.item.valueKey){
                            this.valueKey=this.item.valueKey
                        }
                        this.list=val
                    }
                }
                //初始化初始值,detail 类型 pop模式需要展示值
                if(!isEmpty(this.status)){
                    let haveItem = this.list.find(it=>it[this.valueKey]==this.status)
                    if(haveItem){
                        this.item.showValue=haveItem[this.labelKey]
                    }
                }
            },
            deep:true,
            immediate:true,
        },
        "item.direction":{
            handler(val){
                this.direction=val
            },
            immediate:true
        }
    },
    data(){
        return {
            status:this.value,
            labelKey:'label',
            valueKey:'value',
            direction:this.item.direction?this.item.direction:'row',
            errorInfo:'',
            list:[],
        }
    },
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
input[type="radio"] {
    background-color: initial;
    cursor: default;
    -webkit-appearance: radio;
    box-sizing: border-box;
    margin: 3px 3px 0px 5px;
    padding: initial;
    border: initial;
}
.cell-value{
    .cell-radio-label{
        box-sizing :border-box;
        padding:10px;
        padding-left:0;
        display:flex;
        align-items: center;
    }
    .row{
        display:flex;
        flex-wrap:wrap;
       .cell-radio-label{
            white-space: nowrap;
            max-width: 250px;
            min-width: 60px;
        }
    }
    .column{
        display: flex;
        flex-direction: column;
        .cell-radio-label{
            width:100%;
            word-break: break-all;
        }
    }
    
}
.mint-radio-core{
    width:15px;
    height:15px;
    box-sizing:border-box;
    &:after{
        top: 2.5px;
        left: 2.5px;
    }
}
</style>