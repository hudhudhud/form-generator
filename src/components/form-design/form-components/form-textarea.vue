<template>
<section class="cell-field" ref='textareaWraper' v-if='item.show!==false'>
    <div class="cell-title" :class="{required:item.require}">
        <span class="cell-text">{{item.label}}</span>
    </div>
    <div class="cell-value">
        <textarea  ref='input'  rows="1" class="mint-field-core" v-bind="attrs" v-on="listeners" v-model='txt' 
        :readonly='item.readonly' :data-key='item.key'></textarea>
    </div>
    <p class="error-info">{{errorInfo}}</p>
    <div class="word-limit" v-if='item.maxLen&&!onlyShowIn'>{{txt?txt.length:0}}/{{item.maxLen}}</div>
  </section>
</template>
<script>
import {isEmpty} from '@/utils/index.js'
export default {
    props:{
        item:{
            type:Object,
            default(){
                return {}
            }
        },
        onlyShow:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        "item.value":{
            handler(val){
                this.txt=val
            },
            immediate:true,
        },
        txt:{
            handler(val){
                this.$nextTick(()=>{
                    this.adjustSize()
                    this.format()
                })
                if(this.item.require&&isEmpty(val)){
                    this.errorInfo='请输入'+this.item.label
                    this.$emit('input',val)
                    return
                }
                else{
                    this.errorInfo=''
                }
                this.$emit('input',val)
            },
        },
        onlyShow:{
            handler(val){
                this.onlyShowIn=val
            },
            immediate:true,
        },
        "item.autoSize":{
            handler(val){
                this.autoSize=val
                this.$nextTick(()=>{
                    this.adjustSize()
                    this.format()
                })
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
    mounted(){
        this.adjustSize()
        this.format()
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
            txt:this.value,
            autoSize:this.item.autoSize?this.item.autoSize:false,
            errorInfo:'',
            onlyShowIn:false,
            attrs:[]
        }
    },
    methods:{
        format() {
            if(!this.item.maxLen){
                return
            }
            if (this.txt && this.txt.length > this.item.maxLen) {
                this.$nextTick(()=>{
                    this.txt = this.txt.slice(0, this.item.maxLen);
                })
            }
        },
        adjustSize() {
            const { input,textareaWraper } = this.$refs;
            if (!this.autoSize || !input) {
                return;
            }

            input.style.height = 'auto';
            textareaWraper.style.height = 'auto';

            let height = input.scrollHeight;
            if (typeof this.autoSize === 'object') {
                const { maxHeight, minHeight } = this.autoSize;
                if (maxHeight) {
                    height = Math.min(height, maxHeight);
                }
                if (minHeight) {
                    height = Math.max(height, minHeight);
                }
            }

            if (height) {
                input.style.height = height + 'px';
                textareaWraper.style.height = height+10+(this.item.maxLen?25:0)+ 'px';
            }
        },
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
.cell-field{
    position:relative;
    .word-limit{
        margin-top:5px;
        position:absolute;
        right:10px;
        bottom:5px;
        color: #646566;
        font-size: 12px;
        line-height: 16px;
        text-align: right;
    }
    .cell-value{
        textarea{
            padding:0;
            resize:none;
        }
    }
}
</style>
