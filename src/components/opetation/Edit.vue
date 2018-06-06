<template>
  <div>

  <p class="location">
    <router-link to="/index/operationStorage" class="grey">运营池</router-link>>编辑
    <button class="detele-btn" @click="deleteLists" title="删除">删除</button>
    
  </p>
    <div class="wrap-margin wrap-padding">
        <XEditor :content="ruleForm.content_html" v-on:change="onContentChange"/>
    </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source" required>
          <el-input v-model="ruleForm.source"></el-input>
        </el-form-item>
        <!-- <el-form-item label="时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.created_at" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <el-form-item label="时间">
          <p>{{ruleForm.created_at}}</p>
        </el-form-item>
        <el-form-item label="分类" prop="type_name">
           <el-col :span="11">
          <el-select v-model="ruleForm.type_name" placeholder="请选择分类" width="100%"  @change="typeNameChange">
            <el-option v-for="item in types" :label="item.typeName" :key="item.id" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
           </el-col>
        </el-form-item>
        <el-form-item label="封面" prop="display_type">
          <el-radio-group v-model="display_type">
            <el-radio :label="1" v-if="display_type !==4">无图</el-radio>
            <el-radio :label="2" v-if="display_type !==4">单张大图</el-radio>
            <el-radio :label="4" v-if="display_type ==4">单张大图</el-radio>
            <el-radio :label="3" v-if="display_type !==4">单张小图</el-radio>
            <el-radio :label="5" v-if="display_type !==4">三图</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item v-if="imgShow.length>=1">
          <div v-for="(item ,index) in imgShow" :key="index">
            <div v-if="display_type==2 || display_type==4">
              <img :src="item" width="180" height="114"/>
            </div>
            <div v-if="display_type ==3 || display_type ==5" class="img-item">
              <img :src="item" width="90" height="57"/>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="展示标签" prop="type">
          <el-checkbox-group
            v-model="checkedTags">
            <el-checkbox v-for="item in tags" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <button @click="saveData" class="btn" type="button">保存并预览</button>
          <button class="btn" type="button" v-if="btnShow">保存并发布</button>
          <button @click="publishData"  type="button" class="btn" v-if="!btnShow">保存并发布</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import operationService from '../../service/operation';
  import commonService from '../../service/common';
  import XEditor from "../_common/Editor";
  export default {
    name: 'edit',
    data () {
      return {
        radio2: 1,
        input:'',
        editorText:"",
        flag:false,
        inputTags:'',
        checkedTags: [],
        tags: [],
        id:'',
        ruleForm: {
          content_html: "",
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
          this.open("不符合单张大图,请选择其他模式")
       }
      }
     if(this.display_type ==3){//220*140 单张小图
        this.selectedImgs(690,388);
        if(this.cover.length >0){
          this.ruleForm.display_type =3;
          this.selectedImgs(220,140);
          this.ruleForm.coverage  = this.cover[0];
          this.imgShow = this.ruleForm.coverage.split(",")
       }else{
          this.display_type = 1;
          this.open("不符合单张小图,请选择其他模式")
       }
     
    

      }
      if(this.display_type ==5){ //220*140 三张图
        this.selectedImgs(220,140);
        if(this.cover.length >2){
          this.ruleForm.display_type =5;
          this.ruleForm.coverage  = this.cover[0] + ','+ this.cover[1] +","+ this.cover[2]
          this.imgShow = this.ruleForm.coverage.split(",")
        }else{
          this.display_type = "";
          this.open("不符合三图标准,请选择其他模式")
        }


      }

    },
    // article_imgs
    type_name:function(){
        this.types.forEach(item => {
        if(this.type_name==item.typeName){
           this.ruleForm.type_id = item.id;

        }
      });
      },
    inputTags: function(val) { //选择标签
      this.inputTagsChange(val);
    },
      checkedTags: function(val){
        this.tags.forEach(item=>{
          this.inputTags = this.inputTags.replace(item.tag_name+',', '')
      })
        val.forEach(item=>{
          if(this.inputTags.indexOf(item) == -1){
          this.inputTags = item + ',' + this.inputTags
        }
        this.inputTags = this.inputTags.replace(/,$/,'')
      });
    }
  },
  methods: {
    //发布
    publishData(){
      this.btnShow = true;
    this.ruleForm.tag = this.inputTags;
     if(this.flag){
        this.ruleForm.type_id = this.type_name;
      }
      operationService.editData(this.ruleForm).then(data => {
        if (data.code == 0) {
            const params = {
                id: this.id
              };
            operationService.publishData(params).then(data=>{
                if(data.data.code==0){
                this.$router.push({path:'../../index/operationStorage'});

              }else{
                this.btnShow = false;
                this.open(data.data.msg)
              }
            })
        } else {
           this.btnShow = false;
          this.open(data.msg)
        }
      });


      },
      deleteLists(){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const params = {
              ids:this.id
            };
            operationService.deleteData(params).then(data=>{
        
              if(data.code==0){
                this.$router.push({ path: "../../index/operationStorage/"});
            }else{
              this.open(data.msg)
            }
          })
        })
      },
        //type
    typeNameChange(val){
      this.flag=true;
 

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
     if(this.ruleForm.article_imgs !== undefined){
      this.ruleForm.article_imgs.forEach(item => {
            const height = item.img_w*item.img_radio;
            if(height>h && item.img_w>w){
              this.cover.push(item.img_url)            
              return false;

            }
          })
     }

          },
    inputHandler(val) {
      this.ruleForm.content_html = val;
    },
    saveData() {
      this.ruleForm.tag = this.inputTags;
     if(this.flag){
        this.ruleForm.type_id = this.type_name;
      }
      operationService.editData(this.ruleForm).then(data => {
        if (data.code == 0) {
          this.$router.push({ path: "../../index/publish/" + this.id });
        } else {
          // this.open();
          this.open(data.msg)
        }
      });
    },
    onContentChange (val) {
      this.ruleForm.content_html = val;
    },
    afterChange () {
    }

    },
    created(){
      this.id = this.$route.params.id
    },
    mounted(){
       if (localStorage.getItem("account") == null) {
      this.$router.push({ path: "/" });
      return;
    }
      operationService.detailData(this.id).then(data=>{
        if(data.code==0){
        this.ruleForm = data.data;
        this.imgShow = this.ruleForm.coverage.split(",");
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        this.inputTagsChange();
      }
    })
      commonService.typeList().then(data => {
        if(data.code == 0){
        this.types = data.data;
          this.types.forEach(item => {
            if(this.type_id==item.id){
                this.type_name = item.typeName;
                }     
      })
        }
        })
 commonService.typetags({type_id:this.type_id}).then(data => {
          if (data.code == 0) {
           this.tags =data.data;
          
          }
        });
    //   commonService.tagList().then(data => {
    //     if(data.code == 0){

    //     this.tags = data.data;
    //   }
    // })

    },
  components: {
    XEditor
  }
      }

</script>
<style>
.mce-branding {
  display: none !important;
}
</style>
<style scoped>
 .detele-btn{
   vertical-align: middle;
   top: 22px;
   right: 30px;
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
