<template>
<section class="cell-field" v-if='item.show!==false'>
    <div class="cell-title" :class="{required:item.require}">
        <span class="cell-text">{{item.label}}</span>
    </div>
    <div class="cell-value">
        <template>
            <input type="text" v-model='showValue' v-bind="attrs" v-on="listeners" readonly @click='showBook' :data-key='item.key' @focus="focus" ref="formInput">
            <div class="mint-field-clear" style="" v-if='!item.disableClear&&showValue' @click='showValue=""'>
                <i class="mintui mintui-field-error"></i>
            </div>
        </template>
    </div>
    <p class="error-info">{{errorInfo}}</p>
    <DeptSelectPopup  @change='deptChange' v-model="deptPopVisible" :chooseMutiple="item.mode==='multi'"/>
</section>
</template>
<script>
import {Field} from 'mint-ui'
import DeptSelectPopup from './deptSelectPopup'
export default {
    components:{
        [Field.name]:Field,
        DeptSelectPopup,
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
            },
            immediate:true,
        },
        showValue(val){
            if(this.item.require&&!val){
                this.errorInfo='请选择'+this.item.label
            }
            else{
                this.errorInfo=''
            }
            if(!val){
                this.realValue=''
                delete this.item.selectItems
                //this.$emit('input','')
                this.selectedUserIds=[]
                this.selectedDepartmentIds=[]
            }
        },
        realValue:{
            handler(val){
                let res=val
                if(val!==this.showValue&&this.showValue &&typeof val !=='object'){
                    res = {value:val,showValue:this.showValue}
                }
                this.$emit('input',res)
                if(val&&typeof val ==="string"){
                    if(this.item.chooseType&&this.item.chooseType.indexOf('user')>-1){
                        this.selectedUserIds=val.split(',')
                    }
                    if(this.item.chooseType&&this.item.chooseType.indexOf('department')>-1){
                        this.selectedDepartmentIds=val.split(',')
                    }
                }
            },
            immediate:true,
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
    data(){
        return {
            errorInfo:'',
            realValue:'',
            showValue:'',
            selectedUserIds:this.item.selectedUserIds,
            selectedDepartmentIds:this.item.selectedDepartmentIds,
            onlyShowIn:false,
            deptPopVisible:false,
            attrs:[]
        }
    },
    methods:{
        showBook(){
            if(this.item.chooseType.indexOf('user')>-1){
                alert('pc端不支持通讯录选择,请用真机调试!')
            }
            else if(this.item.chooseType.indexOf('department')>-1){
                this.deptPopVisible=true
            }
            else{
                alert("请选择通讯录类型！")
            }
            return
        },
        //解决部分ios的readonly无效问题
        focus(){
            this.$refs['formInput'].blur()
        },
        deptChange(values){
            values = values.map(it=>{
                return {
                    id:it.selectValue,
                    name:it.selectName,
                    parents:it.parents
                }
            })
            this.item.selectItems={
                departmentList:values,
            }    
            //this.selectedDepartmentIds=values.map(it=>it.id)
            // this.$emit('input',this.item.selectItems)   
            this.realValue = values.map(it=>it.id)
            this.showValue=values.map(it=>it.name)
        },
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
</style>