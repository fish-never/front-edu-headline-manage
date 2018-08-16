<template>
  <div>

   <p class="location clearfloat">
     <router-link to="/index/published" class="grey">已发布</router-link>>编辑
     <!-- <button class="add-btn" @click="updataStatusDown">下架</button> -->
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
            <el-radio :label="2" v-if="display_type==2">单张大图</el-radio>
            <el-radio :label="3" v-if="display_type==3">单张小图</el-radio>
            <el-radio :label="4" v-if="display_type==4">单张大图</el-radio>
            <el-radio :label="5" v-if="display_type==5">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item >
          <div v-for="item in cover" :key="item" v-if="display_type!==1">
            <div v-if="ruleForm.display_type==2 || ruleForm.display_type==4">
              <img :src="item" width="180" height="114"/>
            </div>
            <div v-if="ruleForm.display_type==3 || ruleForm.display_type ==5" class="img-item">
              <img :src="item" width="90" height="57"/>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedTags">
            <el-checkbox v-for="item in tags" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="浏览量" required>
          <el-input v-model="ruleForm.read_count" placeholder="" type="num"></el-input>
        </el-form-item>
        <el-form-item label="评论数" required>
          <el-input v-model="ruleForm.comment_count " placeholder=""  type="num"></el-input>
        </el-form-item>
        <el-form-item label="点赞数" required>
          <el-input v-model="ruleForm.like_count" placeholder=""  type="num"></el-input>
        </el-form-item>
        <el-form-item label="转发数" required>
          <el-input v-model="ruleForm.share_count" placeholder=""  type="num"></el-input>
        </el-form-item>

        <el-form-item>
          <button @click="previewData" class="btn" type="button">保存并预览</button>
          <!-- <button class="btn" type="button" v-if="btnShow">保存并发布</button>
          <button class="btn" @click="publishData" type="button"  v-if="!btnShow">保存并发布</button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import publishedService from '../../service/published';
  import commonService from '../../service/common';
  import XEditor from "../_common/Editor";

  export default {
    name: 'edit',
    data () {
      return {
        radio2: 1,
        input:'',
        editorText:"",
        inputTags:'',
        checkedTags: [],
        tags: [],
        id:'',
        display_type:"",
        ruleForm: {
        content_html: "",
      },
      types: "",
      type_name:"",
      type_id:"",
      cover:[],
      imgShow:[],
      flag:false,
      options:"",
      btnShow:false


      }
    },
    created(){
      this.id = this.$route.params.id
    },
    watch:{
      // display_type:function(){
      //   if(display_type==1){
      //       this.ruleForm.display_type =1
      //   }else{
      //     this.ruleForm.display_type = display_type
      //   }
      // },
    // display_type:function(){ //封面
    //   // this.ruleForm.coverage = "";
    //   this.imgShow = []      
    //   console.log(this.cover)
    //   if(this.display_type ==1){  //无封面
    //     this.ruleForm.display_type =1;
    //       return
    //   }
    //   if(this.display_type ==2 || this.display_type ==4){ // 690*388 单张大图
    //       this.selectedImgs(690,388);
    //         if(this.cover.length >0){
    //           this.ruleForm.coverage  = this.cover[0];
    //           this.ruleForm.display_type =this.display_type ;
    //           this.imgShow = this.ruleForm.coverage.split(",")
    //    }else{
    //       this.display_type = 1;
    //       this.open("不符合单张大图690*388,请选择其他模式")
    //    }
    //   }
    //  if(this.display_type ==3){//220*140 单张小图
    //      this.selectedImgs(220,140);
    //     if(this.cover.length >0){
    //       this.ruleForm.display_type =3;
    //       this.ruleForm.coverage  = this.cover[0];
    //       this.imgShow = this.ruleForm.coverage.split(",")
    //    }else{
    //       this.display_type = 1;
    //       this.open("不符合单张小图220*140标准,请选择其他模式")
    //    }
    //   }
    //   if(this.display_type ==5){ //220*140 三张图
    //     this.selectedImgs(220,140);
    //     if(this.cover.length >2){
    //       this.ruleForm.display_type =5;
    //       this.ruleForm.coverage  = this.cover[0] + ','+ this.cover[1] +","+ this.cover[2]
    //       this.imgShow = this.ruleForm.coverage.split(",")
    //     }else{
    //       this.display_type = 1;
    //       this.open("不符合三图标准,请选择其他模式")
    //     }


    //   }
    //   console.log(this.ruleForm.article_imgs)
    // },

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
    updataStatusDown(id,status){
         this.$confirm('确定下架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: this.id,
            status:2
          };
          publishedService.updataStatus(params).then(data=>{
            if(data.code==0){
                this.$router.push({path:'../../../index/published'});
          }else{
            this.open(data.msg)
          }
        })
        }).catch(() => {       
        });

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
  //  selectedImgs(h,w){
  //     this.ruleForm.article_imgs.forEach(item => {
  //           const height = item.img_w*item.img_radio;
  //           if(height>h && item.img_w>w){
  //             this.cover.push(item.img_url)            
  //             return false;

  //           }
  //         })

  //         },

    inputHandler(val) {
      this.ruleForm.content = val;
    },
    // 
    previewData(){
      this.ruleForm.tag = this.inputTags;
      this.ruleForm.display_type = this.display_type;
      if(this.flag){
        this.ruleForm.type_id = this.type_name;
      }
      if(this.ruleForm.display_type == 1){
        this.ruleForm.coverage =""
      }
      console.log(this.ruleForm.display_type)
      publishedService.previewData(this.ruleForm).then(data=>{
        if(data.code==0){
          this.$router.push({ path: "../../../index/published/publish/" + this.id });
       }else{
          this.open(data.msg)
       }
    })
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
    publishedService.sourceList().then(data=>{
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

      publishedService.view(this.id).then(data=>{ 
        if(data.code==0){
        this.ruleForm = data.data;
        this.imgShow = this.ruleForm.coverage.split(",");
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        this.cover = this.ruleForm.coverage.split(",")
        console.log(this.cover)
        this.inputTagsChange();

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
    components:{
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
.add-btn{
      position: relative;
    top: 20px;
    right: 20px;
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
