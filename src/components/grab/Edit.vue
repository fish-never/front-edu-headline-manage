<template>
  <div>

    <p class="location"><router-link class="grey" to="/index">抓取池</router-link>>编辑   <button class="detele-btn" @click="deleteLists" title="删除"></button></p>
    <div class="wrap-margin wrap-padding">
        <XEditor :content="ruleForm.content" v-on:change="onContentChange"/>
    </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
        <el-select v-model="ruleForm.source" clearable  placeholder="内容源">
           <el-col :span="11">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"  width="100%">
          </el-option>
           </el-col>
        </el-select>
        </el-form-item>
        <el-form-item label="时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.created_at" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="type_name">
           <el-col :span="11">
          <el-select v-model="type_name" placeholder="请选择分类" width="100%" @change="typeNameChange">
            <el-option v-for="item in types" :label="item.typeName" :key="item.id" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
           </el-col>
        </el-form-item>
        <el-form-item label="封面" prop="display_type">
          <el-radio-group v-model="display_type">
            <el-radio :label="1">无图</el-radio>
            <el-radio :label="2">单张大图</el-radio>
            <el-radio :label="3">单张小图</el-radio>
            <el-radio :label="5">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="imgShow.length>=1">
          <div v-for="(item ,index) in imgShow" :key="index">
            <div v-if="ruleForm.display_type==2">
              <img :src="item" width="180" height="114"/>
            </div>
            <div v-if="ruleForm.display_type !==1 && ruleForm.display_type !==2" class="img-item">
              <img :src="item" width="90" height="57"/>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedTags" class="tag-wrap">
            <el-checkbox v-for="item in tags" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <button @click="saveData" class="btn" type="button">保存并预览</button>
          <button class="btn" type="button" v-if="btnShow">保存并发布</button>
          <button class="btn" @click="publishData" type="button"  v-if="!btnShow">保存并发布</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import grabService from "../../service/grab";
import commonService from "../../service/common";
import XEditor from "../_common/Editor";
export default {
  name: "edit",
  data() {
    return {
      radio2: 1,
      input: "",
      editorText:"",
      inputTags: "",
      checkedTags: [],
      tags: [],
      flag:false,
      id: "",
      ruleForm: {
        content: "",
      },
      types: "",
      type_name:"",
      type_id:"",
      display_type:"",
      cover:[],
      imgShow:[],
      options:"",
      btnShow:false

      
    };
  },

  watch: {
    display_type:function(){ //封面
      this.ruleForm.coverage = "";
      this.imgShow = []      
      if(this.display_type ==1){  //无封面
        this.ruleForm.display_type =1;
          return
      }
      if(this.display_type ==2 || this.display_type ==4){ // 690*388 单张大图
          this.selectedImgs(690,388);
            if(this.cover.length >0){
              this.ruleForm.coverage  = this.cover[0];
              this.ruleForm.display_type =this.display_type ;
              this.imgShow = this.ruleForm.coverage.split(",")
       }else{
          this.display_type = 1;
          this.open("不符合单张大图690*388,请选择其他模式")
       }
      }
     if(this.display_type ==3){//220*140 单张小图
         this.selectedImgs(220,140);
        if(this.cover.length >0){
          this.ruleForm.display_type =3;
          this.ruleForm.coverage  = this.cover[0];
          this.imgShow = this.ruleForm.coverage.split(",")
       }else{
          this.display_type = 1;
          this.open("不符合单张小图220*140标准,请选择其他模式")
       }
      }
      if(this.display_type ==5){ //220*140 三张图
        this.selectedImgs(220,140);
        if(this.cover.length >2){
          this.ruleForm.display_type =5;
          this.ruleForm.coverage  = this.cover[0] + ','+ this.cover[1] +","+ this.cover[2]
          this.imgShow = this.ruleForm.coverage.split(",")
        }else{
          this.display_type = 1;
          this.open("不符合三图标准,请选择其他模式")
        }


      }
      console.log(this.ruleForm.article_imgs)
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
  methods: {
      publishData(){
      this.btnShow = true;
      this.ruleForm.id = this.ruleForm._id;
      this.ruleForm.tag = this.inputTags;
      if(this.flag){
        this.ruleForm.type_id = this.type_name;
      }
      grabService.saveData(this.ruleForm).then(data => {
        if (data.code == 0) {
          const params = {
            id:this.ruleForm._id
          }
          grabService.publishData(params).then(data=>{
              if(data.code==0){
                  this.$router.push({path:'../../index'});
            }else{
               this.btnShow = false;
              this.open(data.msg)
            }
          })
        } else {
          this.open(data.msg);
        }
      })
    },
          //删除
      deleteLists(){
        console.log(this.id)
           const params = {
              ids:this.id
           };
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          grabService.detele(params).then(data=>{
            if(data.code==0){
            this.$router.push({ path: "../../index"});
            }else{
            this.open(data.msg)
            }

          })
        })
      },
    //type
    typeNameChange(val){
      this.flag=true;
      console.log(val)

    },
    inputTagsChange(){
      this.checkedTags = [];
      this.tags.forEach(item => {
        if (this.inputTags.indexOf(item.tag_name) != -1) {
          this.checkedTags.push(item.tag_name);
        }
      });
    },
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    // 封面
   selectedImgs(h,w){
      this.ruleForm.article_imgs.forEach(item => {
            const height = item.img_w*item.img_radio;
            if(height>h && item.img_w>w){
              this.cover.push(item.img_url)            
              return false;
            }
          })
          },
    inputHandler(val) {
      this.ruleForm.content = val;
    },
    saveData() {
      this.ruleForm.tag = this.inputTags;

      if(this.flag){
        this.ruleForm.type_id = this.type_name;
      }
      console.log(this.type_name instanceof Number)
      console.log(this.ruleForm.type_id)
      grabService.saveData(this.ruleForm).then(data => {
        if (data.code == 0) {
          this.$router.push({ path: "../../index/publish/" + this.id });
        } else {
          this.open(data.msg);
        }
      });
    },
    onContentChange (val) {
      this.ruleForm.content = val;
    },
    afterChange () {
    }
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    grabService.sourceList().then(data=>{
      if(data.code==0){
        this.options = data.data;
        return Promise.resolve();
      }
    }).then(data=>{
      commonService.tagList().then(data => {
          if (data.code == 0) {
            this.tags = data.data;
            return Promise.resolve();
          }
        });

    }).then(data=>{
      grabService.editData(this.id).then(data => {
      if (data.code == 0) {
        this.ruleForm = data.data;
        this.imgShow = this.ruleForm.coverage.split(",");
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        this.inputTagsChange();
        console.log(3333,this.inputTags)
        console.log( this.type_id)
      }
       commonService.typeList().then(data => {
        if (data.code == 0) {
          this.types = data.data;
          this.types.forEach(item => {
            if(this.type_id==item.id){
                this.type_name = item.typeName;
            }
            
          });
        }
      })
    })
  })
     

  },
  components: {
    XEditor
  }
};
</script>
<style>

.mce-branding {
  display: none !important;
}
</style>
<style scoped>
.disabled{
  pointer-events:none
}
 .detele-btn{
   vertical-align: middle;
   top: 22px;
   right: 30px;
 }
.item-wrap {
  width: 290px;
  height: 258px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  float: left;
  text-align: left;
  margin: 20px;
  padding: 2px 23px 0 14px;
}
.title {
  font-size: 16px;
  color: rgba(52, 71, 80, 1);
  line-height: 22px;
}
.tag {
  font-size: 12px;
  color: rgba(179, 179, 179, 0.99);
  line-height: 12px;
}
.text {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
}
.el-checkbox {
    padding-right: 30px;
}
  .el-checkbox+.el-checkbox {
    margin-left: 0px; 
  }
</style>
