<template>
  <div>

   <p class="location clearfloat">
     <router-link to="/index/published" class="grey">已发布</router-link>>编辑
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
            <el-radio :label="1" v-if="display_type !==4">无图</el-radio>
            <el-radio :label="2" v-if="display_type !==4">单张大图</el-radio>
            <el-radio :label="3" v-if="display_type !==4">单张小图</el-radio>
            <el-radio :label="4" v-if="display_type== 4">单张大图</el-radio>
            <el-radio :label="5" v-if="display_type !==4">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="display_type!==1">
          <div v-for="(item,index) in cover" :key="index" class="img-item">
            <img :src="item" width="90" height="57" @click="checkImg(item)" :class="{line:checkCover(item)}"/>
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
        article_imgs:[],
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
      this.id = this.$route.params.id; 
    },
    watch:{
      display_type: function(){
        console.log(this.cover)
      },
    // display_type:function(){ //封面
    //   this.imgShow.length =0 
    //   if(this.display_type ==2){ // 690*388 单张大图
    //   // console.log(454545)
    //       this.selectedImgs(690,388);
    //         if(this.cover.length >0){
    //           this.cover.forEach(item=>{
    //             this.imgShow.push(item)
    //           })
             
    //    }else{
    //       this.display_type = 1;
    //       this.open("不符合单张大图690*388,请选择其他模式")
    //    }
    //   }
    //  if(this.display_type ==3){//220*140 单张小图
    //      this.selectedImgs(220,140);
    //     if(this.cover.length >0){
    //          this.cover.forEach(item=>{
    //             this.imgShow.push(item)
    //           })   
    //    }else{
    //       this.display_type = 1;
    //       this.open("不符合单张小图220*140标准,请选择其他模式")
    //    }
    //   }
    //   if(this.display_type ==5){ //220*140 三张图
    //     this.selectedImgs(220,140);
    //     if(this.cover.length >2){
    //          this.cover.forEach(item=>{
    //             this.imgShow.push(item)
    //           })

    //     }else{
    //       this.display_type = 1;
    //       this.open("不符合三图标准,请选择其他模式")
    //     }
    //   }
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
   // 获取封面列表

    //选中封面
    checkCover(url){
      console.log(url)
      return this.ruleForm.coverage ? this.ruleForm.coverage.indexOf(url) != -1 : false;
    },
    checkImg(item){
      console.log(item)
      if(this.display_type == 5){
         let ms = this.ruleForm.coverage ? this.ruleForm.coverage.split(",") : [];
         let idx = ms.indexOf(item)
         if(idx == -1){
           ms.push(item)
         }else{
           ms.splice(idx,1);
         }
         if(ms.length>3){
           ms.splice(0,1)
         }
         this.ruleForm.coverage = ms.join(",")
      }else if(this.display_type == 1){
          this.ruleForm.coverage = "";
      }else{
         this.ruleForm.coverage = item
      }

    },
        // 判断封面是否符条件
    checkCoverLength(callback){
      this.ruleForm.display_type = this.display_type;
      let type = this.ruleForm.display_type;
      let imgLists= this.ruleForm.coverage ? this.ruleForm.coverage.split(',') : [];
      let n = imgLists.length;
      console.log(n)
      if(type==5){
         if(n<3){
           this.open("封面数小于3,");
            return
         }
        
      }
      if(type==3||type==2){
        if(n<1){
            this.open("请选择封面");
             return
         }
      }
      callback();
    },
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
  //      // 封面
  //  selectedImgs(){
  //    this.getCover();
  //    this.cover.length=0;
  //   this.cover= this.article_imgs
  //  },

    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },

    inputHandler(val) {
      this.ruleForm.content = val;
    },
    // 
    previewData(){
      this.checkCoverLength(item =>{
          this.ruleForm.tag = this.inputTags;
          this.ruleForm.display_type = this.display_type;
          if(this.flag){
            this.ruleForm.type_id = this.type_name;
          }
          publishedService.previewData(this.ruleForm).then(data=>{
            if(data.code==0){
              this.$router.push({ path: "../../../index/published/publish/" + this.id });
          }else{
              this.open(data.msg)
          }
        })
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
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        let cover1 = this.ruleForm.coverage.split(",")

        console.log(this.ruleForm.content_html)
        let html = $(this.ruleForm.content_html);
        let n = html.find('img').length; //最多获取10张


        if(n>10){
         
          for(let i =0; i<10;i++){
            let src = html.find("img").eq(i).attr("src")
            this.cover.push(src)
          }
        }else{
          for(let i =0; i<n;i++){
            console.log(html.find("img").eq(i))
          let src = html.find("img").eq(i).attr("src")
          this.cover.push(src)
           console.log( html.find("img").eq(i))

        }
        }
        cover1.forEach(item =>{
          if(this.cover.indexOf(item)<0){
              this.cover.push(item)
          }
        })
    
       console.log(this.cover)
      


        // this.cover = this.ruleForm.coverage.split(",")
        // console.log(this.cover)
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
    }).then(data => {
      
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
.line{
    border: 3px solid #409EFF;
}
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
