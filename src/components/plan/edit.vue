<template>
<div  v-loading="loading" class="pushadd">
  <div class="search-wrap  mgr20">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index/plan/index' }">成长计划</el-breadcrumb-item>
      <el-breadcrumb-item>修改计划</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="search-wrap" style="width:600px;">
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="计划图标(用户)"  prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="计划图标(全部)"  prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="计划图标(转发)"  prop="title">
        <el-input v-model="form.title" ></el-input>
      </el-form-item>

      <el-form-item label="计划标题" prop="url_id">
        <el-input v-model="form.url_id"  placeholder="40字符以内(20汉子以内)"></el-input>
      </el-form-item>
      <el-form-item label="计划简介" prop="description">
        <el-input type="textarea" v-model="form.description"  placeholder="400字符以内(200汉子以内)"></el-input>
      </el-form-item>
      <el-form-item label="关联话题" prop="openids">
        <el-input v-model="form.openids" placeholder="话题ID(数字)"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')"  v-if="!btnShow">保存</el-button>
        <button class="gray-btn" type="button" v-if="btnShow">正在保存</button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
  import planService from '../../service/plan';
  import commonService from '../../service/common';
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
        time1:'',
        data1:'',
        time2:'',
        data2:'',
        url: 'pages/index1/index1',
        publish_time: '',
        send_time: '',
        type: 1,
        url_id: '0',
        openids:'',
        description:''
      },
      rules: {
        title: [
          { required: true, message: '文章标题', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请选择进入小程序查看的位置',trigger: 'change'}
        ],
        publish_time: [
          {  required: true, message: '请选择时间',trigger: 'change'}
        ],
        data2: [
          {  required: true, message: '请选择日期',trigger: 'change'}
        ],
        time2: [
          {  required: true, message: '请选择时间',trigger: 'change'}
        ],
        data1: [
          {  required: true, message: '请选择日期',trigger: 'change'}
        ],
        time1: [
          {  required: true, message: '请选择时间',trigger: 'change'}
        ],
        send_time: [
          {  required: true, message: '请选择时间',trigger: 'change'}
        ],
        url_id:[
          {  required: true, message: '请输入文章ID', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择活动资源', trigger: 'blur' }
        ],
        openids:[
          { message: 'OPENID', trigger: 'blur'}
        ]
      },
    }
  },
  created(){
    this.loading = false;
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

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //保存
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        var vm = this
        if (valid) {
          vm.form.url="pages/index1/index1"
          vm.form.publish_time=vm.form.data1+' '+vm.form.time1
          vm.form.send_time=vm.form.data2+' '+vm.form.time2

          if(vm.type){
            vm.form.type = 2;
            //theForm.send_time=theForm.send_time.format('yyyy-MM-dd h:m:s')
          }else{
            vm.form.type = 1;
            vm.form.send_time=''
          }
          vm.form.url_id=parseInt(vm.form.url_id)
          //theForm.publish_time=theForm.publish_time.format('yyyy-MM-dd h:m:s')

          pushService.saveAdd(vm.form).then(data=>{
            if(data.code==0){
              vm.$router.push({ path: "../../index/push/index?"+data.data.result })
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

<style>
  .pushadd .datetime .el-form-item{float:left;margin-right:20px;}
  .lineheight20 .el-form-item__label{line-height: 20px;}
  .inline .el-breadcrumb{float:left;height:32px;line-height: 32px;margin-right:20px;}
</style>
<style lang="scss" scoped>
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


</style>
