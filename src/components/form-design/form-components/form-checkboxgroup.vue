<template>
    <section class="cell-field">
        <div class="cell-title" :class="{required:item.require}">
            <span class="cell-text">{{item.label}}</span>
        </div>
        <div class="cell-value">
            <div :class="{row:direction=='row',column:direction=='column'}">
                <label class="cell-checkbox-label" v-for='(it,i) of options' :key='i'>
                    <input type="checkbox" v-bind="$attrs" v-model='it.checked'  v-on='listeners' class="mint-checkbox-input"
                    :disabled='item.readonly'> 
                    <span class="mint-checkbox-core"></span>
                    <span class="mint-checkbox-label">{{it[labelKey]}}</span>
                </label>
            </div>
        </div>
        <p class="error-info">{{errorInfo}}</p>
    </section>
</template>
<script>
export default {
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
            handler(val,old){
                if(val){
                    this.status=val.split(',')
                }
                else{
                    this.status=[]
                }
            },
            immediate:true,
            deep:true,
        },
        status:{
            handler(val,old){
                if(val===old||(Array.isArray(val)&&Array.isArray(old)&&val.join()===old.join())){
                    return
                }
                if(!Array.isArray(this.options)){return}
                this.options.forEach(it=>{
                    if(Array.isArray(val)&&val.find(item=>item==it[this.valueKey])){
                        this.$set(it,'checked',true)
                    }
                    else{
                        this.$set(it,'checked',false)
                    }
                })
                if(val&&val.length){
                    this.$emit('input',val.join(','))
                }
                else{
                    this.$emit('input','')
                }
                
                //为callback时提供整个对象
                let objs = JSON.parse(JSON.stringify(this.options.filter(it=>it.checked)))
                if(objs.length){                
                    objs.forEach(it=>{
                        if(this.labelKey!='label'){
                            delete it.label
                        }
                        if(this.valueKey!='value'){
                            delete it.value
                        }
                        delete it.checked
                    })
                    this.item.selectItems=objs
                }
                
            },
        },
        "item.options":{
            handler(val){
               this.init()
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
    computed: {
        listeners: function () {
            var vm = this
            return Object.assign({},
                this.$listeners,
                {
                    change: function (event) {
                        vm.status = vm.options.filter(it=>it.checked).map(it=>it[vm.valueKey])
                        if(vm.item.require&&!vm.status.length){
                            vm.errorInfo='请选择'+vm.item.label
                        }
                        else{
                            vm.errorInfo=''
                        }
                    },
                    input:function(){}
                }
            )
        }
    },
    data(){
        return {
            status:[],
            options:[],
            labelKey:'label',
            valueKey:'value',
            direction:this.item.direction?this.item.direction:'row',
            errorInfo:'',
        }
    },
    methods:{
        init(){
            let val = this.item.options
            if(Array.isArray(val)){
                this.options=[]
                //判断是值数组还是对象数组
                if(val&&val.length){
                    if(typeof val[0] !== 'object'){
                        val.forEach(it=>{
                            //防止配置了labelKey,valueKey，options却是值数组的情况
                            this.options.push({[this.labelKey]:it,[this.valueKey]:it})
                        })
                    }
                    else{
                        if(this.item.labelKey){this.labelKey=this.item.labelKey }
                        if(this.item.valueKey){this.valueKey=this.item.valueKey }
                        this.options=val
                    }
                    //初始化选中项
                    this.initOptions()
                }
            }
            else if(typeof val ==='string'&& typeof window[val] === 'function'){
                window[val]((res)=>{
                    if(typeof res[0] !== 'object'){
                        res.forEach(it=>{
                            //防止配置了labelKey,valueKey，options却是值数组的情况
                            this.options.push({[this.labelKey]:it,[this.valueKey]:it})
                        })
                    }
                    else{
                        if(this.item.labelKey){this.labelKey=this.item.labelKey }
                        if(this.item.valueKey){this.valueKey=this.item.valueKey }
                        this.options=res
                    }
                    //初始化选中项
                    this.initOptions()
                })
            }
        },
        initOptions(){
            this.options.forEach(it=>{
                if(Array.isArray(this.status)&&this.status.find(item=>item==it[this.valueKey])){
                    this.$set(it,'checked',true)
                }
                else{
                    this.$set(it,'checked',false)
                }
            })
        }
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
input[type="checkbox"] {
    background-color: initial;
    cursor: default;
    -webkit-appearance: checkbox;
    box-sizing: border-box;
    margin: 3px 3px 3px 4px;
    padding: initial;
    border: initial;
}
.cell-value{
     .cell-checkbox-label{
        box-sizing: border-box;
        padding:10px;
        padding-left:0;
        align-items: center;
    }
    .row{
        display:flex;
        flex-wrap:wrap;
       .cell-checkbox-label{
            // width:80px;
            white-space: nowrap;
            max-width: 250px;
        }
    }
    .column{
        display:flex;
        flex-direction: column;
        .cell-checkbox-label{
            width:100%;
            word-break: break-all;
        }
    }
}
.mint-checkbox-core{
    border-radius: 0;
    width:14px;
    height:14px;
    &:after{
        left:4px;
        top:1px;
    }
}
</style>