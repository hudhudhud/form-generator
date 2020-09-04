<template>
<section class="cell-field" >
    <div class="cell-title">
        <span class="cell-text">hidden组件</span>
    </div>
    <div class="cell-value">
        <template> 
            <input type="text" v-model='item.value' :data-key='item.key'>
        </template>
    </div>
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
}
</script>
<style scoped lang='scss'>
@import  'form-common.scss';
.cell-field{
    box-sizing: border-box;
    overflow-x: hidden;
    &:last-child{
        border-bottom: none !important;
    }
    display: flex;
    width:100%;
    height: 40px;
    line-height: 1;
    padding: 0 10px;
    font-size: 14px;
    align-items: center;
    border-bottom:1px solid #d9d9d9;
    text-align:center;
    background-color:rgba(0,0,0,0.1)
    
}
</style>