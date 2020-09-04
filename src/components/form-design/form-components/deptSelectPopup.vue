<template>
    <mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal='false' :modal='false'>
        <div class="search-content" >
            <div class="list" :class='{chooseMutiple:chooseMutiple}'>
                <template v-if='chooseMutiple'>
                    <div v-for='(it,i) of list'  :key='i' class="item">
                        <el-checkbox  v-model='it.checked' >
                            <span class="txt main">{{it.selectName}}</span>
                        </el-checkbox>
                        <div @click.stop="getDeptList(it)" style='width:20%;text-align:right' >
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="(it,i) in list" :key='i' @click='confirmPop(it)' class="cell item">
                        <p class="txt main">{{it.selectName}}</p>
                        <p @click.stop="getDeptList(it)" style='width:20%;text-align:right'>
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </p>
                    </div>
                </template>
                <div class="tip-txt" v-if='!loading&&(!list||!list.length)'>
                    <p>没有相关数据</p>
                </div>
            </div>
            <div class="select-items" v-if='chooseMutiple&&selectItems.length'>
                <el-tag v-for="(item,i) in selectItems" :key="i" closable style='margin-right:5px' @close='item.checked=false' effect="plain">
                    {{item.selectName}}
                </el-tag>
            </div>
            <div class='btns' >
                <mt-button type="default" @click='back' v-if='path.length>1' style='margin-right:10px'>返回上一级</mt-button>
                <mt-button type="primary" v-if='chooseMutiple'  @click="confirmPop" style='margin-right:10px'>确认</mt-button>
                <mt-button type="default" @click='popupVisible=false'>取消</mt-button>
            </div>
        </div>
    </mt-popup>
</template>
<script>
import {Tag,Checkbox,Input} from 'element-ui'
import {Popup,Button,Indicator  } from 'mint-ui'
import {GET_DEPT} from '@/utils/api'
import Request from '@/utils/request'
export default {
    components:{
        [Tag.name]:Tag,
        [Popup.name]:Popup,
        [Button.name]:Button,
        [Checkbox.name]:Checkbox,
        [Input.name]:Input
    },
    props:{
        value:{
            type:Boolean,
            default:false,
        },
        chooseMutiple:{
            type:Boolean,
            defalut:false
        },
    },
    watch:{
        value:{
            handler(v){
                this.popupVisible=v;
            },
            immediate:true,
        },
        popupVisible(v){
            if(v){
                if(!this.list.length){
                   this.getDeptList()
                }
                document.body.style.overflow='hidden'
            }
            else{
                document.body.style.overflow=''
            }
            this.$emit('input',v)
        },
    },
    data(){
        return {
            list:[],//显示在页面上的list
            allList:[],//所有点击过的所有部门信息，用于过滤checked对象
            popupVisible:false,
            allObj:{},//以value为key暂存所有部门信息以及其子部门
            path:[],//暂存点击部门列表路径，用于返回时直接获取
            loading:false
        }
    },
    methods:{
        confirmPop(it){
            //获取其父级部门路径
            let tempList=[]
            if(this.chooseMutiple){
                tempList = JSON.parse(JSON.stringify(this.selectItems))
            }
            else{
                tempList=[JSON.parse(JSON.stringify(it))]
            }
            tempList.forEach(it=>{
                let parents=[]
                parents.unshift({id:it.selectValue,name:it.selectName})
                let parCode = this.allObj[it.selectValue].parent
                while(parCode){
                    let par = this.allObj[parCode]
                    parents.unshift({id:par.selectValue,name:par.selectName})
                    parCode = this.allObj[par.selectValue].parent
                }
                it.parents=parents
            })

            this.$emit('change',tempList)
            this.popupVisible=false
        },
        async getDeptList(item){
            console.log(2222222222,GET_DEPT)
            if(item){
                let val = item.selectValue
                //已经获取过子部门则直接显示
                if(this.allObj[val].children){
                    this.list=this.allObj[val].children
                    this.path.push(this.list)
                    return
                }
                else{
                //否则获取其子部门信息
                    let res = await Request.get(GET_DEPT,{params:{depid:val}})
                    this.allObj[val].children=res.data.depNameList
                    this.list=res.data.depNameList
                    this.list.map(it=>{
                        this.$set(it,'checked',false)
                    })
                    this.list.forEach(it=>{
                        this.allObj[it.selectValue]={selectValue:it.selectValue,selectName:it.selectName,children:undefined,parent:val}
                    })
                    this.allList.push(...this.list)
                    this.path.push(this.list)
                    return
                }
            }
            else{
                // 获取第一级部门
                try{
                    Indicator.open()
                    this.loading=true
                    this.path=[]
                    this.allList=[]
                    let res = await Request.get(GET_DEPT)
                    this.list=res.data.depNameList
                    this.list.map(it=>{
                        this.$set(it,'checked',false)
                    })
                    this.list.forEach(it=>{
                        this.allObj[it.selectValue]={selectValue:it.selectValue,selectName:it.selectName,children:undefined}
                    })
                    this.allList.push(...this.list)
                    this.path.push(this.list)
                }
                finally{
                    this.loading=false
                    Indicator.close()
                }
            }
        },
        back(){
            this.path.pop()
            this.list=this.path[this.path.length-1]
        }
    },
    computed: {
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
.search-content{
    width:330px;
    height:580px;
    padding:15px;
    box-sizing :border-box;
    position:relative;
    .list{
        overflow-x: hidden;
        margin-top:10px;
        height  :calc(100% - 95px);
        &.chooseMutiple{
            height : calc(100% - 135px);
        }
        padding-top:80px;
        overflow-y:scroll;
        box-sizing : border-box;
        // display: flex;
        // flex-direction: column;
        padding: 5px 10px;
        .item{
            display:flex;
            justify-content  :space-between;
            align-items:center;
            padding:3px 0;
            &:first-child{
                border-top:1px solid #d9d9d9;
            }
            border-bottom:1px solid #d9d9d9;
        }
        .el-checkbox{
            width:80%;
            height: auto;
            padding:5px 0;
            display:flex;
            align-items:center;
            margin-right:0;
            // &:first-child{
            //     border-top:1px solid #d9d9d9;
            // }
            // border-bottom:1px solid #d9d9d9;
            .el-checkbox__label{
                margin-left:10px;
                padding:5px 0;
                height:auto;
                word-break: break-all;
                // width: 100%;
            }
        }
        p.txt{
            white-space: pre-wrap;
            padding:2px 0;
        }
        .main{
            font-size:17px;
            font-weight: 500;
            color:#333;
            white-space: pre-wrap;
        }
        .label{
            font-size:12px;
            color: #999;
        }
        .tip-txt{
            text-align: center;
        }
        .cell{
            padding:10px 0;
        }
    }
    .select-items{
        display:flex;
        width:100%;
        overflow-x :scroll;
        margin-top:15px;
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