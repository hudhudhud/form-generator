<template>
    <section class="cell-field" v-if='item.show!==false'>
        <div class="cell-title" :class="{required:item.require}">
            <span class="cell-text">{{item.label}}</span>
        </div>
        <div class="cell-value">
            <label class="cell-checkbox-label">
                <input type="checkbox" v-model='status'  v-bind="$attrs"  class="mint-checkbox-input" :disabled='item.readonly'> 
                <span class="mint-checkbox-core"></span>
                <span class="mint-checkbox-label">{{item.optionLabel}}</span>
            </label>
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
    watch:{
        "item.value":{
            handler(val){
                this.status=val
            },
            immediate:true,
        },
    },
    data(){
        return {
            status:this.item.value,
        }
    },
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