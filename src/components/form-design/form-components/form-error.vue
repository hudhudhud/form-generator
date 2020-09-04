<template>
    <section class="cell-field">
      {{item.type}}  error components
    </section>
</template>
<script>
export default {
    name:'error',
    props:{
        item:{
            type:Object,
            default:()=>{
                return {}
            }
        }
    }
}
</script>

<style scoped>
section{
    color:red
}
</style>