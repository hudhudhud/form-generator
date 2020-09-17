<template>
<section class="cell-field" v-bind="styClassAttr">
    <div class="cell-title" :class="{required:item.require}">
        <span class="cell-text">{{item.label}}</span>
    </div>
    <div class="cell-value">
        <template> 
            <!-- $attrs的class和style只作用到子组件的最外层 -->
            <input type="text" v-model='txt'   v-bind="{...localAttr,...attrs}" v-on="listeners" :readonly='item.readonly' :data-key='item.key'
            @focus="focus" ref="formInput">
            <div class="mint-field-clear" style="" v-if='!item.readonly&&!item.disableClear&&txt' @click='txt=""'>
                <i class="mintui mintui-field-error"></i>
            </div>
        </template>
    </div>
    <p class="error-info">{{errorInfo}}</p>
</section>
</template>
<script>
import {isEmpty} from '@/utils/index.js'
export default {
    components:{
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
                this.txt=val
            },
            immediate:true,
        },
        "item.label":{
            handler(val){
                this.localAttr={placeholder:val?'请输入'+val:''}
            },
            immediate:true,
        },
        "item.attributes":{
            handler(attributes){
                this.attrs={}
                if(Array.isArray(attributes)){
                    attributes.forEach(at=>{
                        if(at.name){
                            if(at.name=='style'||at.name=='class'){
                                this.styClassAttr[at.name]=at.value
                            }
                            else{
                                this.attrs[at.name]=at.value
                            }
                        }
                    })
                }
            },
            immediate:true,
        },
        txt(val){
            if(this.item.require&&isEmpty(val)){
                this.errorInfo='请输入'+this.item.label
                this.$emit('input',val)
                return
            }
            else{
                this.errorInfo=''
            }
            if(this.item.rules&&this.item.rules.length){
                for(let rule of this.item.rules){
                    if(rule.regexp){
                        let reg = new RegExp(rule.regexp,'gm')
                        // this.inputState=reg.test(val)?'success':'error'
                        if(!reg.test(val)){
                            this.errorInfo=rule.message?rule.message:'输入格式有误'
                            break
                        }
                        else{
                            this.errorInfo=''
                        }
                    }
                }
            }
            this.$emit('input',val)
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
            inputState:'',
            txt:this.value,
            errorInfo:'',
            attrs:{},
            localAttr:{},
            styClassAttr:{}
        }
    },
    methods:{
        //解决部分ios的readonly无效问题
        focus(){
            if(this.item.readonly){
                this.$refs['formInput'].blur()
            }
        },
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
</style>