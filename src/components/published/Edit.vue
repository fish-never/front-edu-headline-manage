<template>
  <div>

   <p class="location clearfloat">
     <router-link to="/index/published" class="grey">已发布</router-link>>编辑
     </p>
    <div class="wrap-margin wrap-padding">
        <XEditor :content="ruleForm.content_html" v-on:change="onContentChange"/>
    </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
          <el-input v-model="ruleForm.source"></el-input>
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
          <el-select v-model="type_name" placeholder="请选择分类" width="100%" @change="typeChange">
            <el-option v-for="(item,index) in types" :label="item.typeName" :key="index" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
           </el-col>
        </el-form-item>
        <el-form-item label="新增标签" required>

          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedTags">
            <el-checkbox v-for="(item,index) in tags"  @change="changeTags(item)" :label="item.tag_name" :key="index"   :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="display_type">
            <el-radio :label="1" v-if="display_type !==4">无图</el-radio>
            <el-radio :label="2" v-if="display_type !==4">单张大图</el-radio>
            <el-radio :label="3" v-if="display_type !==4">单张小图</el-radio>
            <el-radio :label="4" v-if="display_type== 4">单张大图</el-radio>
            <el-radio :label="5" v-if="display_type !==4">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="display_type!=1&& display_type!=4">
          <div v-for="(item,index) in imgShow" :key="index" class="img-item">
            <!-- <img :src="item.src" width="90" height="57" @click="checkImg(item)" :class="{line:checkCover(item.src)}"/> -->
            <div class="img-item" v-if="display_type==2">
              <div class="cover-height cover-img-big" :class="{line: checkCover(item.src)}"  v-if="item.h>=item.w"  :style="{backgroundImage:'url('+ item.src +')',backgroudSize:'auto 100%'}"  @click="checkImg(item)" ></div>
              <!-- 图片宽度大于高度 -->
              <div class="cover-width cover-img-big" v-if="item.h<item.w"  :style="{backgroundImage:'url('+ item.src +')',backgroudSize:'100%'}"  @click="checkImg(item)" :class="{line: checkCover(item.src)}"></div>
            </div>
            <div class="img-item" v-if="display_type!=2">
              <!-- 图片高度大于宽度150px 80px 一张大图：300px 150px -->
              <div class="cover-height cover-img-small"  v-if="item.h>=item.w"  :style="{backgroundImage:'url('+ item.src +')',backgroudnSize:'auto 100%'}"  @click="checkImg(item)" :class="{line: checkCover(item.src),coverwidth:item.flag>1,coverHeight:item.flag<=1}"></div>
              <!-- 图片宽度大于高度 -->
              <div class="cover-width cover-img-small" v-if="item.h<item.w" :style="{backgroundImage:'url('+ item.src +')',backgroudnSize:'100%'}"  @click="checkImg(item)" :class="{line: checkCover(item.src)}"></div>

            </div>
          </div>
        </el-form-item>
          <!-- <el-form-item v-if="display_type==4">
          <div class="img-item">
            <img :src="item.coverage" width="90" height="57"/>
          </div>
        </el-form-item> -->
  
        <el-form-item label="视频连接" required v-show="ruleForm.display_type == 4">
          <el-input v-model="ruleForm.video_uri" placeholder="" type="num"></el-input>
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
        radio2: 1,
        showImgs:true,
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
      btnShow:false,
      showOpen:false,
      article_imgs:[],
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
    created(){
      this.id = this.$route.params.id;

    },
    computed:{
      coverList:function(){
        return this.article_imgs.slice(0,10);
        console.log(this.display_type)
              if(this.display_type ==1){
        this.ruleForm.coverage = ""
      }
      if(this.display_type ==2  || this.display_type ==4){ // 690*388 单张大图
          this.imgShow.length = 0;
          let data = this.article_imgs.slice(0,10)
            data.forEach(item => {
              if(item.w >=690 && item.h >=388){
                  this.imgShow.push(item)
              }
            })
            if(this.imgShow.length <= 0){
             this.display_type = 1;
             this.open("不符合单张大图690*388,请选择其他模式")
           }
      }
     if(this.display_type ==3){//220*140 单张小图
        let data = this.article_imgs.slice(0,10)
        if(data.length >0){
                this.imgShow = data;
       }else{
         this.display_type = 1;
          this.open("不符合单张小图220*140标准,请选择其他模式")
       }
      }
      if(this.display_type ==5){ //220*140 三张图
        let data = this.article_imgs.slice(0,10)
        if(data.length >2){
                this.imgShow = data;
       }else{
         console.log( this.ruleForm.display_type)
            console.log(this.display_type)
          this.display_type = 1;
          this.open("不符合三图标准,请选择其他模式")
        }
      }
      }
    },
    watch:{

    display_type:function(){ //封面
    this.showImgs = false;
      this.imgShow.length =0
      if(this.showOpen){
      if(this.display_type ==1){
        this.ruleForm.coverage = ""
      }
      if(this.display_type ==2  || this.display_type ==4){ // 690*388 单张大图
      console.log(this.imgShow)
          this.imgShow.length = 0;
          let data = this.article_imgs.slice(0,10)
            data.forEach(item => {
              if(item.w >=690 && item.h >=388){
                  this.imgShow.push(item)
              }
            })
            if(this.imgShow.length <= 0){
             this.display_type = 1;
             this.open("不符合单张大图690*388,请选择其他模式")
           }
      }
     if(this.display_type ==3){//220*140 单张小图
        let data = this.article_imgs.slice(0,10);
        console.log(this.imgShow)
        if(data.length >0){
                this.imgShow = data;
       }else{
         this.display_type = 1;
          this.open("不符合单张小图220*140标准,请选择其他模式")
       }
      }
      if(this.display_type ==5){ //220*140 三张图
        let data = this.article_imgs.slice(0,10);
        if(data.length >2){
                this.imgShow = data;
       }else{
          this.display_type = 1;
          this.open("不符合三图标准,请选择其他模式")
        }
      }

      }
    },
    inputTags: function(val) { //选择标签
    console.log(val)
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
  methods: {
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
    filterCovers(list){
      var src = "";
      var result = [];
      list.forEach(item=>{
        if(src.indexOf(item.src) == -1){
          result.push(item);
          src+= item.src + ',';
        }
      })
      return result;
    },
//图片加载
    globalImgOnload(img){
      let data = {
        w: img.width,
        h: img.height,
        src: img.src
      }
      let imgs = [];
      if(img.width>220 && img.height >140){
        this.article_imgs.push(data)
      }
      this.showOpen = true;

    },

    //选中封面
    checkCover(src){
      return this.ruleForm.coverage ? this.ruleForm.coverage.indexOf(src) != -1 : false;
    },
    checkImg(item){
    //  console.log(item)
      if(this.display_type == 5){
         let ms = this.ruleForm.coverage ? this.ruleForm.coverage.split(",") : [];
         let idx = ms.indexOf(item.src)
         if(idx == -1){
           ms.push(item.src)
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
         this.ruleForm.coverage = item.src
      }

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
      this.getTags(val);//下拉框改变的val正好就是tpye_id

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


    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },

    inputHandler(val) {
      this.ruleForm.content = val;
    },
    previewData(){
      this.checkCoverLength(item =>{
          this.ruleForm.tag = this.inputTags;
          this.ruleForm.display_type = this.display_type;
          if(this.flag){
            this.ruleForm.type_id = this.type_name;
          }
           if(this.ruleForm.tag == "" || this.ruleForm.source == ""|| this.ruleForm.type_id =="" || this.ruleForm.title =="" || this.ruleForm.share_count =="" || this.ruleForm.like_count =="" || this.ruleForm.comment_count =="" || this.ruleForm.read_count ==""){
               this.open("必填项不能为空");
               return false;
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

    mounted(){
       window.globalImgOnload = this.globalImgOnload;
       if (localStorage.getItem("Token") == null) {
          this.$router.push({ path: "/" });
          return;
        }
    publishedService.sourceList().then(data=>{
      if(data.code==0){
        this.options = data.data;
        return Promise.resolve();
      }
    }).then(data=>{

      publishedService.view(this.id).then(data=>{
        if(data.code==0){
        this.ruleForm = data.data;
        this.type_id = this.ruleForm.type_id;
        this.display_type = parseInt(this.ruleForm.display_type);
        this.inputTags = this.ruleForm.tag;
        let cont_html = this.ruleForm.content_html.replace(/\<img /ig, "<img onload='globalImgOnload(this)' ");
        let html = $(cont_html);
        this.inputTagsChange();
      }else{

      }
    }).then(() => {
      commonService.typeList().then(data => {
        if (data.code == 0) {
          this.types = data.data;
          this.types.forEach(item => {
            if(this.type_id==item.id){
                this.type_name = item.typeName;
            }
          });
          // this.getTags(this.type_id);
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
.cover-height,.cover-width{
  background-position:center;
  background-repeat: no-repeat;
}
.cover-height{
  background-size:auto 100%;
}
.cover-width{
  background-size:100% auto;
}
.cover-img-big{
    width:300px;
    height:150px;
    border-radius:4px;
  }
.cover-img-small{
  width:150px;
  height:80px;
  border-radius:4px;

}
.img-item{
  margin-bottom:20px;
}
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
