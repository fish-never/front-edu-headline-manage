<template>
  <div>
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池444</router-link>>新建文章</p>
    <div class="wrap-margin wrap-padding">
      <el-tabs v-model="activeName" @tab-click="handleClick">
         <el-tab-pane label="图文文章" name="first">
      <el-form :model="textData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="textData.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
          <el-input v-model="textData.origin_link"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="type_id">
          <el-select v-model="textData.type_id" placeholder="请选择分类" >
            <el-option v-for="item in types" :label="item.typeName" :key="item.id" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="display_type">
          <el-radio-group v-model="display_type">
            <el-radio :label="1">无图</el-radio>
            <el-radio :label="2">单张大图</el-radio>
            <el-radio :label="3">单张小图</el-radio>
            <el-radio :label="5">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class='clearfloat' v-show='display_type==5'>
          <div v-for='item in files' :key="item.id">
          <UploadFile v-on:filechange="filechange(item)" :file="item.url" @click="upImg(item)"/>
          <!-- <UploadFile v-on:filechange="filechange"/>
          <UploadFile v-on:filechange="filechange"/> -->
          </div>
          <p class='up-img'>图片建议尺寸220*140</p>

        </el-form-item>
        <el-form-item class='clearfloat' v-show='display_type==2'>
          <UploadFile v-on:filechange="filechange" :file="file"/> 
          <p class='up-img'>图片建议尺寸690*388</p>
        </el-form-item>
       <el-form-item class='clearfloat' v-show='display_type==3'>
          <UploadFile v-on:filechange="filechange" :file="file"/>
          <p class='up-img'>图片建议尺寸220*140</p>
        </el-form-item>
        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedTags">
            <el-checkbox v-for="item in tags" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
         <el-form-item label="正文编辑" prop="content">
              <XEditor :content="textData.content_html" v-on:change="onContentChange"/>
        </el-form-item>

        <el-form-item>
          <button @click="textSaveData"  type="button" class="btn">保存并预览</button>
        </el-form-item>
      </el-form>

    </el-tab-pane>
    <el-tab-pane label="视频文章" name="second">
    </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import operationService from '../../service/operation';
  import commonService from '../../service/common';
  import XEditor from "../_common/Editor";
  import UploadFile from "../_common/UploadFile";
  export default {
    name: 'opedit',
    data () {
      return {
         file:require("../../assets/imgs/add.png"),
        activeName: 'first',
        display_type:0,
        radio2: 1,
        input:'',
        editorText:"",
        inputTags: "",
        files:[
          {
            id:1,
            url:""
          },
          {
            id:2,
            url:""
          },
          {
            id:3,
            url:""
          },
        ],
        checkedTags: [],
        tags: [],
        id:'',
        textData:{
          content_html:"",
          coverage:"",
          origin_link:'',
          source:'',
          video_uri:''
        },
        imageUrl: '',

        types:""

      }
    },
    watch:{
      //监控封面
      display_type: function(val){
        this.textData.display_type = val;
        console.log(val)
        console.log(this.textData.display_type)

      },
      inputTags: function(val) { //选择标签
          this.inputTagsChange(val)
        },
      checkedTags: function(val) {
        this.tags.forEach(item => {
          this.inputTags = this.inputTags.replace(item.tag_name + ",", "");
        });
        val.forEach(item => {
          if (this.inputTags.indexOf(item) == -1) {
            this.inputTags = item + "," + this.inputTags;
          }
          this.inputTags = this.inputTags.replace(/,$/,'')
        });
      }
    },
    methods:{
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      upImg(item){
        console.log(item)
        console.log(this.file)
        item.url = this.file;
      },
    inputTagsChange(){
      this.checkedTags = [];
      this.tags.forEach(item => {
        if (this.inputTags.indexOf(item.tag_name) != -1) {
          this.checkedTags.push(item.tag_name);
        }
      });
    },
    filechange(url){
      console.log(url)
      this.textData.coverage = url;
      this.file = url
       if(this.display_type==5){
          console.log()
        }
        console.log(url);
      },
      handleClick(tab, event) {
          if(tab.index==1){
           this.$router.push({ path: "../../index/video" });
          }
      },
    onContentChange (val) {
      this.textData.content_html = val;
    },
    afterChange () {
    },
      // 保存
      textSaveData(){
        this.textData.tag = this.inputTags;
        operationService.newData(this.textData).then(data=>{
         if(data.code==0){
            this.$router.push({ path: "../../index/operationStorage" })
          }else{
            this.open(data.msg)
          }
      })

      },

    },
    mounted(){
      commonService.typeList().then(data => {
        if(data.code == 0){
        this.types = data.data;
      }
    }),
    commonService.tagList().then(data => {
    if (data.code == 0) {
      console.log(1111,data.data)
      this.tags = data.data;
      return Promise.resolve();
    }
  });

    },
  components: {
    XEditor,
    UploadFile
  }
  }
</script>

<style scoped>
.up-img{
    display: inline-block;
    margin-left: 10px;
    position: relative;
    top: -25px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .item-wrap{
    width:290px;
    height:258px;
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    float:left;
    text-align: left;
    margin:20px;
    padding:2px 23px 0 14px;
  }
  .title{
    font-size:16px;
    color:rgba(52,71,80,1);
    line-height:22px;
  }
  .tag{
    font-size:12px;
    color:rgba(179,179,179,0.99);
    line-height:12px;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }

</style>
