<template>
  <div>

    <div class="location">
      <router-link class="grey" to="/index">抓取池</router-link>>编辑  
       <button class="detele-btn" @click="deleteLists" title="删除">删除</button>
       </div>
    <div class="wrap-margin wrap-padding">
        <XEditor :content="ruleForm.content" v-on:change="onContentChange"/>
    </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="标题" prop="title" >
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
        <el-select v-model="ruleForm.source" clearable  placeholder="内容源">
           <!--<el-col :span="11">-->
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
            width="100%">
          </el-option>
           <!--</el-col>-->
        </el-select>
        </el-form-item>
        <el-form-item label="时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" disabled placeholder="选择日期" v-model="ruleForm.created_at" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="typing">
           <el-col :span="11">
          <el-select v-model="type_name" placeholder="请选择分类" width="100%"  @change="typeChange">
            <el-option v-for="(item,index) in types" :label="item.typeName" :key="index" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
           </el-col>
        </el-form-item>
        <el-form-item label="新增标签"  prop="taging">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group  v-model="checkedTags" class="tag-wrap">
            <el-checkbox v-for="(item,index) in tags" :label="item.tag_name"  :key="index" :value="item.id" @change="changeTags(item)" >{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封面" >
          <el-radio-group v-model="display_type">
            <el-radio :label="1">无图</el-radio>
            <el-radio :label="2">单张大图</el-radio>
            <el-radio :label="3">单张小图</el-radio>
            <el-radio :label="5">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="imgShow.length>=1">
          <div v-for="(item ,index) in imgShow" :key="index">
            <div class="img-item">
              <img :src="item.url" width="90" height="57"  @click="checkImg(item)" :class="{line: checkCover(item.url)}" />
            </div>
           <!-- <div v-if="display_type ==5" class="img-item">
              <img :src="item.url" width="90" height="57"  @click="checkImg(item)" :class="{line: checkCover(item.url)}"/>
            </div> -->
          </div>
        </el-form-item>



        <el-form-item>
          <button @click="saveData" class="btn" type="button">保存并预览</button>
          <button class="gray-btn" type="button" v-if="btnShow">正在发布</button>
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
      },
      types: "",
      type_name:"",
      type_id:"",
      display_type:"",
      cover:[],
      imgShow:[],
      options:"",
      btnShow:false,
      display_type_5:[],
      coverages:[]

      
    };
  },

  watch: {
    display_type:function(){ //封面
      this.imgShow.length =0 
      if(this.display_type ==2){ // 690*388 单张大图
          this.selectedImgs(690,388);
            if(this.cover.length >0){
              this.cover.forEach(item=>{
                let object = {
                  url:item,
                  selected: false
                }
                this.imgShow.push(object)
              })
              if(this.display_type == this.ruleForm.display_type){ //默认模式如果是当前模式，封面回显
                this.imgShow.forEach(item =>{
                    if(item.url ==  this.ruleForm.coverage){
                      item.selected = true
                    }else{
                      this.imgShow.forEach(item =>{
                          item.selected = false
                        })
                    }
                  })
              }
             
       }else{
          this.display_type = 1;
          this.open("不符合单张大图690*388,请选择其他模式")
       }
      }
     if(this.display_type ==3){//220*140 单张小图
         this.selectedImgs(220,140);
        if(this.cover.length >0){
             this.cover.forEach(item=>{
                let object = {
                  url:item,
                  selected: false
                }
                this.imgShow.push(object)
              })
              if(this.display_type == this.ruleForm.display_type){ 
                this.imgShow.forEach(item =>{
                    if(item.url ==  this.ruleForm.coverage){
                      item.selected = true
                    }
                  })
              }else{
                this.imgShow.forEach(item =>{
                    item.selected = false
                  })
              }
        
       }else{
          this.display_type = 1;
          this.open("不符合单张小图220*140标准,请选择其他模式")
       }
      }
      if(this.display_type ==5){ //220*140 三张图
        this.selectedImgs(220,140);
        if(this.cover.length >2){
             this.cover.forEach(item=>{
                let object = {
                  url:item,
                  selected: false
                }
                this.imgShow.push(object)
              })
              if(this.display_type == this.ruleForm.display_type){
                   let coverList = this.ruleForm.coverage.split(",");
               }else{
                this.imgShow.forEach(item =>{
                    item.selected = false
                  })
              }

        }else{
          this.display_type = 1;
          this.open("不符合三图标准,请选择其他模式")
        }
      }
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
        }else{

        }
        this.inputTags = this.inputTags.replace(/,$/,'')
      });
    }
  },
  methods: {
    //标签勾选
    changeTags(val){
      if(this.inputTags == val.tag_name){
        this.inputTags = ""
      }
    },
    //判断是否已被选择
     checkCover(url){
       return this.ruleForm.coverage ? (this.ruleForm.coverage.indexOf(url) != -1) : false;
     },
    //选中图片
    checkImg(item){
       if(this.display_type ==1){
          this.ruleForm.coverage = "";
      }
      if(this.display_type ==2 || this.display_type==3){
          this.ruleForm.coverage = item.url;
      }
     if(this.display_type ==5){
       
       let ms = this.ruleForm.coverage ? this.ruleForm.coverage.split(',') : [];

       let idx = ms.indexOf(item.url);
       if(idx == -1){
           ms.push(item.url); 
        }else{
          ms.splice(idx,1); 
        }
        if(ms.length>3){
          ms.splice(0,1);  
        }
        this.ruleForm.coverage = ms.join(','); 
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
            console.log("here")
           this.tags =temp;
           this.inputTags = "";
           this.inputTagsChange()

          }
        });
     },
   // 封面
   selectedImgs(h,w){
     this.cover.length=0;
     const n = this.ruleForm.article_imgs.length;
     let imgLists = [];
     if(n>10){
       imgLists = this.ruleForm.article_imgs.slice(0,10) 
     }else{
       imgLists = this.ruleForm.article_imgs
     }
     imgLists.forEach(item => {
        let height = item.img_w*item.img_radio;
        if(height>h && item.img_w>w){
          this.cover.push(item.img_url)            
        }
      })
   },

          //删除
      deleteLists(){
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
    typeChange(val){
      this.flag=true; 
      if(val!= undefined){
        this.getTags(val);//下拉框改变的val正好就是tpye_id
      }
       
    },
    inputTagsChange(){
      this.checkedTags = [];
      this.tags.forEach(item => {
        if (this.inputTags.indexOf(item.tag_name) != -1) {
          this.checkedTags.push(item.tag_name);
        }else{
          console.log(5555)
        }
      });
    },
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    // 判断封面是否符条件
    checkCoverLength(callback){
      this.ruleForm.display_type = this.display_type;
      let type = this.ruleForm.display_type;
      let imgLists= this.ruleForm.coverage ? this.ruleForm.coverage.split(',') : [];
      let n = imgLists.length;
      if(type==5){
         if(n<3){
           this.open("封面数小于3");
            return
         }
        
      }
      if(type==3||type==2){
        if(n<1){
            this.open("请选择封面");
             return
         }else if(n>1){
           this.open("封面数大于1");
           return
         }
      }
      callback();
    },

    inputHandler(val) {
      this.ruleForm.content = val;
    },
    // 保存并预览
    saveData() {
      this.checkCoverLength(item =>{
        this.ruleForm.tag = this.inputTags;
          if(this.flag){
            this.ruleForm.type_id = this.type_name;
          }
            if(this.ruleForm.tag == "" || this.ruleForm.source == ""|| this.ruleForm.type_id =="" || this.ruleForm.title ==""){
               this.open("必填项不能为空");
               return false;
           }
        grabService.saveData(this.ruleForm).then(data => {
            if (data.code == 0) {
              this.$router.push({ path: "../../index/publish/" + this.id });
            } else {
              this.open(data.msg);
            }
          });
      });


    },
    //保存并发布
    inputTagsChange(){
      this.checkedTags = [];
      this.tags.forEach(item => {
        if (this.inputTags.indexOf(item.tag_name) != -1) {
          this.checkedTags.push(item.tag_name);
        }
      });
    },
    publishData(){
      this.checkCoverLength(item =>{
        this.btnShow = true;
        this.ruleForm.id = this.ruleForm._id;
        this.ruleForm.tag = this.inputTags;
        if(this.flag){
          this.ruleForm.type_id = this.type_name;
        }
          if(this.ruleForm.tag == "" || this.ruleForm.source == ""|| this.ruleForm.type_id =="" || this.ruleForm.title ==""){
               this.open("必填项不能为空");
               return false;
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
            this.btnShow = false;
            this.open(data.msg);
          }
        })
      })
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
     if (localStorage.getItem("Token") == null) {
      this.$router.push({ path: "/" });
      return;
    }
    grabService.sourceList().then(data=>{
      if(data.code==0){
        this.options = data.data;
        return Promise.resolve();
      }
    }).then(data=>{
      grabService.editData(this.id).then(data => {
      if (data.code == 0) {
        this.ruleForm = data.data;
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        this.getTags(this.type_id)
      }
    }).then( data => {
        commonService.typeList().then(data => {
        if (data.code == 0) {
          this.types = data.data;
          this.types.forEach(item => {
            if(this.type_id==item.id){
                this.type_name = item.typeName;
            }
            
          });
        }
      }).then(data=>{
      // 根据分类id查询该分类下的标签
      //  this.getTags(this.type_id);
      commonService.typetags({type_id:this.type_id}).then(data => {
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
          this.inputTags = this.ruleForm.tag; 
          this.inputTagsChange()
          }
        });

      });

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
.line{
    border: 3px solid #409EFF;
}
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
