<template>
<div  v-loading="loading" class="pushadd">
  <div class="search-wrap  mgr20">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index/plan/index' }">成长计划</el-breadcrumb-item>
      <el-breadcrumb-item>修改计划</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="search-wrap  wrap-margin wrap-padding" >
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="计划图标(全部)"  prop="icon">
        <el-input v-model="form.icon"></el-input>
        <div class="cover-list">
           <UploadFile v-model="form.icon" />
        </div>
      </el-form-item>
      <el-form-item label="计划图标(用户)"  prop="user_icon">
        <el-input v-model="form.user_icon"></el-input>
          <div class="cover-list">
           <UploadFile v-model="form.user_icon" />
        </div>
      </el-form-item>
      <el-form-item label="计划图标(转发)"  prop="share_icon">
        <el-input v-model="form.share_icon" ></el-input>
        <div class="cover-list">
           <UploadFile v-model="form.share_icon" />
        </div>
      </el-form-item>
      <el-form-item label="计划标题"  prop="title">
        <el-input v-model="form.title"  placeholder="20字符以内" maxlength="20"></el-input>
        <p class="tip_text">修改名称请谨慎，需要保证修改前后的表意连贯</p>
      </el-form-item>
      <el-form-item label="计划简介" prop="description">
        <el-input type="textarea"  :autosize="{ minRows: 6}" v-model="form.description" placeholder="200字符以内" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="关联话题" prop="topic_id">
        <el-input v-model="form.topic_id" placeholder="话题ID(数字)" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')"  v-if="!btnShow">保存</el-button>
        <button class="gray-btn" type="button" v-if="btnShow">正在保存</button>
        <el-button @click="goIndex" >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
  import planService from '../../service/plan';
  import commonService from '../../service/common';
  import UploadFile from "../_common/UploadFile";
export default {
  name: 'preview',
  data () {
    return {
      loading: true,
      data:[],
      id:"",
      btnShow:false,
      type:false,
      url:'小程序首页',
      form: {
        title: '',
        description:'',
        icon:'',
        user_icon:'',
        share_icon:'',
        topic_id:'',
        plan_id:'',
        id:''
      },
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
        ],
        icon:[
          {  required: true, message: '图标不能为空', trigger: 'blur' }
        ],
        user_icon: [
          { required: true, message: '图标不能为空', trigger: 'blur' }
        ],
        share_icon: [
          { required: true, message: '图标不能为空', trigger: 'blur' }
        ],
        topic_id: [
          { required: true, message: '关联话题不能为空', trigger: 'blur' }
        ]


      },
    }
  },
  components: {
    UploadFile
  },
  created(){
    this.loading = false;
    this.id = this.$route.query.id
  },
  mounted(){
    this.getDetail();
    // getDetail
  },
  methods:{
    //弹框
    open(text) {
      this.$alert(text, '信息', {
        confirmButtonText: '确定',
      });
    },
    goIndex(){
       this.$router.push({ path: "../../index/plan/index"})
    },
    getDetail(){
      let params = {
        plan_id:this.id
      }
      planService.getDetail(params).then(data=>{
        if(data.code==0){
          this.form = data.data[0];
          this.form.plan_id = this.id;
        }else{
          this.btnShow = false;
          this.open(data.msg)
        }
      })    
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //保存
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        var vm = this
        if (valid) {
          planService.update(vm.form).then(data=>{
            if(data.code==0){
              vm.$router.push({ path: "../../index/plan/index"})
            }else{
              vm.btnShow = false;
              vm.open(data.msg)
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });

    }
  }

}

</script>

<style lang="scss" scoped>
  .pushadd .datetime .el-form-item{float:left;margin-right:20px;}
  .lineheight20 .el-form-item__label{line-height: 20px;}
  .inline .el-breadcrumb{float:left;height:32px;line-height: 32px;margin-right:20px;}


  .title-p{
    font-size:24px;
    color:#333;
    line-height:25px;
  }
  .location{
    height:60px;
    line-height:60px;
    font-size:14px;
    color:#333;
    padding-left:39px;
  }
.wrap{
  background:rgba(255,255,255,1);
  border-radius: 8px ;
  text-align: left;
  margin:0 20px 20px 20px ;
  padding:2px 23px 0 14px;
}
.tip_text{
  color:#C4C4C4;
}
.item{
  padding:54px 63px;
}


  .grey{
    color:#999;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }
.cover-list{
  margin-left:20px;
  width:80px;
  height:40px;
  display: inline-block;
  background: #fff;
  overflow: hidden;
  position: relative;
  top: 15px;
  border:1px solid #dedede;
}
.up-btn{
  float: right;
}
.el-input {
  width:400px;
}

</style>
