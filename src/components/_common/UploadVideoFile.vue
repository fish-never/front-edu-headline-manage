<template>
    <div class="upload-btn"  :value="value" :title="file" :style="{backgroundImage:'url('+ fileBg +')'}">
      <input type="file" class="file-input" :name="feildName" @change="fileChange"/>
    </div>
    <!-- <div>
    <img class="upload-btn"  :src="file" />
      <input type="file" class="file-input" name="imgFile" @change="fileChange"/>
    </div> -->
    
</template>

<script>
import Vue from 'vue'
import router from '../../router'
import uploader from '../../utils/uploadVideo'

export default {
  name: "UploadFile",
  props: ['value'],
  data() {
    return {
      feildName: Date.now() + '' + parseInt(Math.random() * 100000),
      file:null,
      fileBg:require("../../assets/imgs/add.png")
    };
  },
  watch:{
    value(val){
      if(val){
        // this.fileBg = require("../../assets/imgs/video.png")
      }
      this.file = val;
    },
    file(val){
      console.log(val)
      this.$emit('input', val);
    }
  },
  mounted() {
    if (this.value) {
      this.file = this.value;
    }
  },
  methods: {
   fileChange: function(val){
     console.log(999)
     console.log(val)
     uploader.uploadToOss((val)=>{
      //  this.fileBg = require("../../assets/imgs/video.png")
       this.file = val.data.url;
       console.log(this.file)
     }, this.feildName)
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
