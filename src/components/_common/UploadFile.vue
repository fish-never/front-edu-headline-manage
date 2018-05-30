<template>
    <div class="upload-btn"  :style="{backgroundImage:'url('+ file +')'}">
      <input type="file" class="file-input" name="imgFile" @change="fileChange"/>
    </div>
    <!-- <div>
    <img class="upload-btn"  :src="file" />
      <input type="file" class="file-input" name="imgFile" @change="fileChange"/>
    </div> -->
    
</template>

<script>
import Vue from 'vue'
import router from '../../router'
import uploader from '../../utils/upload'

export default {
  name: "UploadFile",
  data() {
    return {
      file:require("../../assets/imgs/add.png"),
    };
  },
  methods: {
   fileChange(val){
     uploader.uploadToOss((val)=>{
       console.log(val.data)
       this.file = val.data.url;
       this.$emit('filechange', val.data.url);
     })
   }
  },

};
</script>

<style scoped>

.upload-btn{
  display: inline-block;
  margin-right:16px;
  width: 94px;
  height: 60px;
  padding: 0;
  margin: 0;
  overflow:hidden;
  /* background:url('../../assets/imgs/add.png'); */
  background-size: 100% 100%;
  cursor: pointer;
}

.file-input{
  top:0;
  margin: 0;
  padding: 0;
  width: 94px;
  height: 60px;
  background: #fff;
  opacity: 0;
  border:1px solid red;
}


</style>
