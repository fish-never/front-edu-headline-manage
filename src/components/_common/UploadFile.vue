<template>
    <div class="upload-btn"  :value="value" :style="{backgroundImage:'url('+ file +')'}"  :class="{uploadW:flag,uploadH:flag}">
      <input type="file" class="file-input" :name="feildName" @change="fileChange"/>
    </div>  
</template>

<script>
import Vue from 'vue'
import router from '../../router'
import uploader from '../../utils/upload'

export default {
  name: "UploadFile",
  props: ['value'],
  data() {
    return {
      feildName: Date.now() + '' + parseInt(Math.random() * 100000),
      file:require("../../assets/imgs/add.png"),
      flag:false
    };
  },
  watch:{
    value(val){
      this.file = val;
    },
    file(val){
      this.$emit('input', val);
      var that = this;
      $.ajax({
        url:val+"?x-oss-process=image/info",
        success:function(data){
           console.log(data)
           var w = parseFloat(data.ImageWidth.value)
           var h = parseFloat(data.ImageHeight.value)
          if(h>=w){
              that.flag=true;
          }else{
              that.flag=false;
          }
        }
      })
    }

  },
  
  mounted() {
    if (this.value) {
      this.file = this.value;
    }
  },
  
  methods: {

   fileChange: function(val){
     uploader.uploadToOss((val)=>{
       this.file = val.data.url;
     }, this.feildName)
   }
  },

};
</script>

<style scoped>

.upload-btn{
  display: inline-block;
  margin-right:16px;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow:hidden;
  background-size:100% auto;
  /* background:url('../../assets/imgs/add.png'); */
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
}
.uploadW{
  background-size:100% auto;
}
.uploadH{
    background-size: auto 100%;
}
.file-input{
  top:0;
  margin: 0;
  padding: 0;
  width: 150px;
  height: 80px;
  background: #fff;
  opacity: 0;
  cursor: pointer;
}


</style>
