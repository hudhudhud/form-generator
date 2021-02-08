<template>
<section class="cell-field">
    <div class="cell-title">
        <span class="cell-text">{{item.label}}</span>
    </div>
    <div class="cell-value">
        <p class='p-only-show'>{{txt}}</p>
    </div>
</section>
</template>
<script>
import {Field} from 'mint-ui'
import {isEmpty} from '@/utils/index.js'
export default {
    components:{
        [Field.name]:Field
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
        "item.value":{
            handler(val){
                this.txt=val
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
            txt:this.value,
        }
    },
    methods:{
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
.cell-field{
    // height:40px;
    min-height: 40px;
    border-bottom: none;
    border-top:none;
    .cell-title{
        text-align: right;
        margin-right:10px;
    }
    .cell-value{

    }
}
</style>