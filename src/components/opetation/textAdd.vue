<template>
  <div>
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池</router-link>>新建文章</p>
    <div class="wrap-margin wrap-padding">
      <el-tabs v-model="activeName" @tab-click="handleClick">
         <el-tab-pane label="图文文章" name="first">
      <el-form :model="textData" label-width="100px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="textData.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
          <el-input v-model="textData.source"></el-input>
        </el-form-item>
        <el-form-item label="原始链接" prop="origin_link">
          <el-input v-model="textData.origin_link"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="typing">
          <el-select v-model="textData.type_id" filterable clearable placeholder="请选择分类" @change="typeChange">
            <el-option v-for="(item,index) in types" :label="item.typeName" :key="index" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新增标签" prop="taging">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group   v-model="checkedTags">
            <el-checkbox v-for="(item,index) in tags" :label="item.tag_name"  @change="changeTags(item)" :key="index" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="display_type">
            <el-radio :label="1">无图</el-radio>
            <el-radio :label="2">单张大图</el-radio>
            <el-radio :label="3">单张小图</el-radio>
            <el-radio :label="5">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class='clearfloat' v-show='display_type==5'>
          <div v-for='item in files' :key="item.id" class="cover-list">
           <UploadFile v-model="item.url" />
          </div>
          <p class='up-img'>图片建议尺寸220*140</p>

        </el-form-item>
        <el-form-item class='clearfloat' v-show='display_type==2'>
          <div class="cover-list-big">
             <UploadFile v-model="files[0].url" />
          </div>
          <p class='up-img'>图片建议尺寸690*388</p>
        </el-form-item>
       <el-form-item class='clearfloat' v-show='display_type==3'>
          <div  class="cover-list" data-id="idList">
            <UploadFile v-model="files[0].url" />
          </div>
          <p class='up-img'>图片建议尺寸220*140</p>
        </el-form-item>

         <el-form-item label="正文编辑" prop="content">
              <XEditor :content="textData.content_html" v-on:change="onContentChange"/>
        </el-form-item>
        <el-form-item>
          <button @click="textSaveData"  type="button" class="btn"  v-if="!btnShow">保存并预览</button>
          <button class="gray-btn" type="button" v-if="btnShow">正在保存</button>
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
        activeName: 'first',
        display_type:5,
        radio2: 1,
        input:'',
        editorText:"",
        inputTags: "",
        checkedTags: [],
        tags: [],
        id:'',
        textData:{
          display_type:5,
          content_html:"",
          coverage:"",
          origin_link:'',
          source:'',
          video_uri:''
        },
        imageUrl: '',
        btnShow:false,
        types:"",
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 40, message: "长度在1到40个字", trigger: "blur" }
        ],
        source:[
          { required: true, message: "请选择来源",trigger: "blur"},
          { min: 1, message: "长度至少1个字符",trigger: "blur" }
        ],
        typing:[
          { required: true, message: "请选择分类", trigger: "blur" },
           { min: 1, message: "长度至少1个字符",trigger: "blur" }
        ],
        // taging:[
        //   { required: true, message: "请选择或输入输入标签", trigger: "blur" },
        //   { min: 1, message: "请选择或输入输入标签",trigger: "blur" }
        // ],
      }
      }
    },
    watch:{
      idList:function(){
        console.log(this.files)
      },
      //监控封面
      display_type: function(val){
        this.textData.display_type = val;
      },
      inputTags: function(val) { //选择标签
          this.inputTagsChange(val)
        },
      checkedTags: function(val) {
        // this.inputTags = "";
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
          //标签勾选
    changeTags(val){
      if(this.inputTags == val.tag_name){
        this.inputTags = ""
      }

      if(this.inputTags.indexOf(val.tag_name) >=0){ // 去掉勾选删去输入框相应部分
         this.inputTags=this.inputTags.replace(val.tag_name,"");
         this.inputTags=this.inputTags.replace(",,",",");// 去掉双逗号
      }

    },
    //根据分类查询标签
     getTags(type_id){
       commonService.typetags({type_id:type_id}).then(data => {
          if (data.code == 0) {
               const temp =[];
            data.data.forEach(item =>{
              if(item.is_default ==="1"){
                 temp.push(item);
              }
            });
           this.tags =temp;
          //  this.tags = data.data;
            this.tags =temp;
            this.inputTags = "";
           this.inputTagsChange()
          }
        });
     },
    typeChange(val){
      this.flag=true;
      if(val!=undefined){//下拉框改变的val正好就是tpye_id,但是初始化下拉列表时val为undefined
      this.getTags(val);
      }
    },
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      upImg(item){
        item.url = this.file;
      },
    inputTagsChange(){
      this.checkedTags = [];
      this.inputTags=this.inputTags.replace(",,",","); // 去掉双逗号
      this.tags.forEach(item => {
        if (this.inputTags.indexOf(item.tag_name) != -1) {
          this.checkedTags.push(item.tag_name);
        }
      });
    },
    filechange(resp){
      console.log(respl);
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

        this.btnShow = true;
        console.log(77777)
        if(this.textData.display_type ==1 ){
          this.textData.coverage = "";
        }else if(this.textData.display_type ==5 ){
          this.textData.coverage = "";
          this.files.forEach(item => {
          this.textData.coverage += item.url +","
          })
           this.textData.coverage  =  this.textData.coverage .replace(/,$/,'')
        }else{
          this.textData.coverage = this.files[0].url;
        }
        this.textData.tag = this.inputTags;
        // console.log(JSON.stringify(this.textData));
        // return false;
        console.log(this.ruleForm)
          if(this.textData.display_type == "" || this.textData.source == ""|| this.textData.tag =="" || this.textData.title ==""){
               this.open("必填项不能为空");
               return false;
           }
        operationService.newData(this.textData).then(data=>{
         if(data.code==0){
            this.$router.push({ path: "../../index/operationPreview/"+data.data.result })
          }else{
            this.btnShow = false;
            this.open(data.msg)
          }
      })

      },

    },
    mounted(){
      if (localStorage.getItem("Token") == null) {
          this.$router.push({ path: "/" });
          return;
        }
      commonService.typeList().then(data => {
        if(data.code == 0){
        this.types = data.data;
      }
    })
  // ,
  //   commonService.tagList().then(data => {
  //   if (data.code == 0) {
  //     console.log(1111,data.data)
  //     this.tags = data.data;
  //     return Promise.resolve();
  //   }
  // });

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
    top: 8px;
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
.cover-list{
  float:left;
  margin-right:20px;
  width:150px;
  height:80px;
}
.cover-list-big{
  float:left;
  margin-right:20px;
  width:300px;
  height:150px;
}
</style>
