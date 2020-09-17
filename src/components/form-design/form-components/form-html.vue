<template>
<section class="cell-field">
    <div class="cell-value">
        <div v-html='item.value' :data-key='item.key'></div>
    </div>
</section>
</template>
<script>
export default {
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
    },
    data(){
        return {
        }
    },
    methods:{
    }
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
</style>