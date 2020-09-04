<template>
    <section class="form-detail-simple">
        <mt-cell :title="item.title">
            <i class="fa fa-plus-circle" aria-hidden="true" @click='addDetail'></i>
        </mt-cell>
        <template v-for='(det,i) of list' >
            <div class="one-item form-detail" :key='i'>
                <FormMenu  :params='item.params'/>
                <span  @click='delDetail(i)' class="del-btn">删除</span>
            </div>
        </template>
    </section>
</template>
<script>
import {Cell,Field} from 'mint-ui'
// import commonFunc from '../common.js'
import FormMenu from './form-menu.vue'
export default {
    components:{
        [Cell.name]:Cell,
        [Field.name]:Field,
        FormMenu,
    },
    props:{
        value:'',
        item:{
            type:Object,
            default(){
                return {}
            }
        },
    },
    watch:{
        "item.params":{
            handler(val){  
                //没有默认值时，默认给一行
                if(!this.list.length){
                    if(!this.item.defaultValue||!this.item.defaultValue.length){
                        let item={componentList:[]}
                        this.list.push(item)
                    }
                }
                else{
                    //重置params
                    this.list.forEach((comp,i)=>{
                        comp.componentList.forEach(compItem=>{
                            let changeParam = val.find(it=>it.key===compItem.item.key)
                            if(changeParam){
                                //commonFunc.setParamForEventAtt(changeParam,compItem)//事件和属性按值赋
                                Object.assign(compItem.item,changeParam)//item赋值
                                this.$set(this.list,i,{componentList:comp.componentList})
                            }
                        })
                    })
                }
            },
            deep:true,
            immediate:true,
        },
        "item.defaultValue":{
            handler(val){  
              if(val&&val.length){
                  val.forEach(it=>{
                    let keys= Object.keys(it)
                    let newItem={componentList:[]}
                    this.list.push(newItem)
                    this.$nextTick(()=>{
                        if(newItem.componentList.length){
                            let com=newItem.componentList.find(comp=>comp.item.key===keys[0])
                            if(com){
                                com.item.value=it[keys[0]]
                            }
                        }
                    })
                  })
              }
            },
            deep:true,
            immediate:true,
        },
        list:{
            handler(val){
                let res=[]
                val.map(comp=>{
                    let obj={}
                    if(comp.componentList.length){
                        let compObj=comp.componentList[0]
                        obj[compObj.item['key']]=compObj.item['value']
                        res.push(obj)
                    }
                })
                this.$emit('input',res)
            },
            deep:true,
            immediate:true,
        },
    },
    data(){
        return{
            list:[],
        }
    },
    methods:{
        addDetail(){
            let newItem={componentList:[]}
            this.list.push(newItem)
            // 每次push都会新增一个FormMenu，item.params初次传入，即会触发formBuild,所以不需要手动调用formBuild
        },
        delDetail(i){
            this.list.splice(i,1)
        },
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
.form-detail-simple{
    .form-detail{
        background-color:#FBFBFB;
        padding:0 20px;
        .mint-cell{
            background-color:#FBFBFB;
        }
        .form-detail-title{
            .mint-cell-text{
                font-weight: bold;
            }
        }
    }
    .one-item{
        display:flex;
        align-items: center;
         .del-btn{
            flex-grow: 1;
            text-align: center;
            font-size:12px;
            color:blue;
            white-space: nowrap;
        }
    }
    .cell-value{
        .p-only-show{
            width:210px;
        }
    }
}

</style>