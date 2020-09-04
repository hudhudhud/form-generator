<template>
    <section>
        <component
        v-for='(it,i) in paramsList' 
        :key='i'
        :is='"form-"+it.type' 
        v-model='it.value' 
        :item='it' 
        >
        </component>
    </section>
</template>
<script>
export default {
    props:{
        params:{
            type:Object,
            default(){
                return {}
            }
        },
    },
    data(){
        return {
            paramsList:[]
        }
    },
    watch:{
        params:{
            handler(val){
                this.paramsList = val
            },
            deep:true,
            immediate:true,
        },
    },
    methods:{
       
    }
}
</script>
<style scoped lang='scss'>


</style>