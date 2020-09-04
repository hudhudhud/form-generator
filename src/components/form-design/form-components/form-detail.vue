<template>
    <section>
        <!-- <FormDetailSimple v-if='item.mode=="simple"' :item='item' v-model="detailList"/> -->
        <el-row :gutter='15'>

        </el-row>
    </section>
</template>
<script>
import FormDetailSimple from './form-detail-simple'
export default {
    components:{
        FormDetailSimple,
        // FormDetailMutiple,
        // FormDetailPop
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
        value:{
            handler(v){
                this.detailList=v
            },
            deep:true,
            immediate:true,
        },
        detailList:{
            handler(v){
                // console.log('9999999999',v)
                this.$emit('input',v)
            },
            deep:true,
            immediate:true,
        },
    },
    data(){
        return {
            detailList:[],
        }
    }
}
</script>