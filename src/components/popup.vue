<template>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" :style='"height:"+height+"px"'>
        <div class="pop-content">
            <div class="pop-txt">
                <p class="title">{{setting.title}}</p>
                <p class="txt" v-html='setting.content'></p>
            </div>
        </div>
        <div class="close" @click="popupVisible=false">
            <i class="fa fa-times" aria-hidden="true" ></i>
        </div>
    </mt-popup>
</template>
<script>
import {Popup} from 'mint-ui'
export default {
    components:{
        [Popup.name]:Popup,
    },
    props:{
      value:'',
      setting:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    watch:{
      value:{
        handler(v){
          this.popupVisible=v
        },
        immediate:true,
      },
      popupVisible(v){
        this.$emit('input',v)
      },
      "setting.popHeight":{
        handler(v){
          if(v){
            this.height=v
          }
        },
        immediate:true,
      },
    },
    data(){
        return {
            popupVisible:false,
            height:400
        }
    }
}
</script>
<style lang='scss' scoped>
.mint-popup{
  background-color:unset;
  width:300px;
  // height:400px;
  .pop-content{
    border-radius :10px;
    background-color:#fff;
    overflow: hidden;
    width:100%;
    height:100%;
    .pop-txt{
      background-color:#fff;
      padding:15px;
      text-align :center;
      color:#666;
      height:100%;
      box-sizing: border-box;
      .title{
        font-size:17px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .txt{
        font-size:13px;
        margin-top:10px;
        overflow-y:scroll;
        line-height: 1.5;
        box-sizing :border-box;
        width:100%;
        height:90%;
        text-align :left;
        font-size:14px;
      }
      .close-all-btn{
        margin-top:20px;
        font-size:11px;
        color:#999
      }
    }
  }
  .close{
    height:50px;
    font-size:30px;
    color:#fff;
    text-align:center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #fff;
    font-size: 12px;
    font-size: 15px;
    line-height: 30px;
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-15px);
  }
}

</style>