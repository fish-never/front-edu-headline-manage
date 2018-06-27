<template>
  <div>
    <p class="location"> <router-link to="/index/PublishingPool" class="grey">发布池内容管理</router-link>>预览</p>
    <div class="wrap">
        <h2 class="title">{{this.title}}</h2>
        <!-- <p class="tag"><span>{{data.tag_name}}</span><span>{{data.type_name}}</span><span>3099年25月66日</span></p> -->
        <div class="text"  style="font-size:16px;" v-html="this.cont"></div>
    </div>
     <div class="wrap">
       <el-form :model="fromdata" :rules="rules"  label-width="100px">
            <el-form-item label="浏览量" required>
              <el-input v-model="fromdata.read_count"></el-input>
            </el-form-item>
            <el-form-item label="点赞数" required>
              <el-input v-model="fromdata.like_count"></el-input>
            </el-form-item>
            <el-form-item label="分享数" required>
              <el-input v-model="fromdata.share_count"></el-input>
            </el-form-item>
            <el-form-item label="热门" required>
              <el-radio v-model="fromdata.is_hot" label="1" >是</el-radio>
               <el-radio v-model="fromdata.is_hot" label="0">否</el-radio>
            </el-form-item>
            
            <el-form-item>
              <el-button class="w100" type="danger" @click="updating()">保存</el-button>
              <el-button  class="quxiao w100" @click="toback">取消</el-button>
            </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import postList from "../../service/postList";
  export default {
    name: 'preview',
    data () {
      return {
        id:"",
        title:'',
        cont:'',
        fromdata: {
          read: '',
          like: '',
          share: '',
          hot: '',
        },
        rules: {
          read: [
            { required: true, message: '请输入浏览量', trigger: 'blur' },
            { min: 1,  message: '浏览量不能为空值', trigger: 'blur'}
          ],
           like: [
            { required: true, message: '请输入点赞数', trigger: 'blur' },
            { min: 1,  message: '点击数不能为空值', trigger: 'blur'}
          ],
          share: [
            { required: true, message: '请输入分享数', trigger: 'blur' },
            { min: 1, message: '分享数不能为空值', trigger: 'blur'}
          ],
          hot: [
            { required: true, message: '请选择热门状态', trigger: 'change' }
          ]
        }
      }
    },
    created(){
      this.id = this.$route.params.id
    },
    mounted(){
       if (localStorage.getItem("Token") == null) {
          this.$router.push({ path: "/" });
          return;
        }
      postList.view(this.id).then(data=>{
        if(data.code==0){
          this.cont = data.data.content.content; // 多层结构或者不在数据源内单独赋值
          this.title = data.data.topic_title;
          this.fromdata = data.data;
      }
    });
    },
    methods:{
       //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    updating(){
      if(this.fromdata.read_count == "" || this.fromdata.like_count == "" || this.fromdata.share_count ==""  || this.fromdata.read_count == null || this.fromdata.like_count == null || this.fromdata.share_count == null){
               this.open("必填项不能为空");
               return false;
           }
    if(isNaN(this.fromdata.read_count) || isNaN(this.fromdata.like_count) || isNaN(this.fromdata.share_count)){
        this.open("修改项必须为数字");
        return false;
    }
      postList.update({
          id:this.fromdata.id,
          comment_count:parseInt(this.fromdata.comment_count),
          read_count:parseInt(this.fromdata.read_count),
          like_count:parseInt(this.fromdata.like_count),
          share_count:parseInt(this.fromdata.share_count),
          is_hot:this.fromdata.is_hot,
          weight:this.fromdata.weight
          }).then(data => {
              if (data.code == 0) {
                this.toback();
              } else {
                this.open(data.msg);
              }
            });
    },
    toback(){
      this.$router.push({path:'/index/contentApproval/PublishingPool'});
    }
    }
  }
</script>

<style scoped>
  .wrap{
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    text-align: left;
    margin:0 20px 20px 20px ;
    padding:35px;
  }
  .title {
  font-size: 18px;
  color: #FD782D;
  line-height: 38px;
  font-weight: 700;
}
  .tag{
    font-size:12px;
    color:#B3B3B3;
    line-height:12px;
    margin:19px 0 39px 0;
  }
  .text{
    margin-top: 21px;
    font-size:14px;
    color:#666;
    line-height:24px;
  }
  .el-input{width:200px;}
  .w100{width:100px;}
  .el-radio__input.is-checked+.el-radio__label {
    color: #FC856E;
}
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #FC856E;
    background: #FC856E;
}
.el-radio__inner {border: 1px solid #FC856E}
.quxiao{border:1px solid #FC856E;color:#FC856E;}
</style>
