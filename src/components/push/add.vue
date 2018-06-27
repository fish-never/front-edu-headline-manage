<template>
<div  v-loading="loading">
  <div class="search-wrap  mgr20">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>推送管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/index/push/index' }">运营推送管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增推送</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="search-wrap" style="width:500px;">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="文章标题"  prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" required>
        <el-form-item prop="publish_time">
        <el-date-picker format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd h:m:s"
          v-model="form.publish_time"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="文章摘要" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="open ID" prop="openids">
        <el-input v-model="form.openids"></el-input>
      </el-form-item>

      <el-form-item label="进入小程序查看的位置" class="lineheight20" prop="url">
        <el-select v-model="form.url" placeholder="请选择进入小程序查看的位置">
          <el-option label="小程序首页" value="pages/index1/index1">小程序首页</el-option>
          <el-option label="文章详情页" value="pages/index1/index1">文章详情页</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章ID" v-if="form.url=='pages/article/article'" prop="url_id">
        <el-input v-model="form.url_id"></el-input>
      </el-form-item>
      <el-form-item label="定时发送" >
        <el-switch v-model="form.type"></el-switch>
      </el-form-item>

      <el-form-item label="" v-if="form.type==true">
        <el-form-item prop="send_time">
        <el-date-picker format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd h:m:s"
          v-model="form.send_time"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        </el-form-item>
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
  import pushService from '../../service/push';
  import commonService from '../../service/common';
export default {
  name: 'preview',
  data () {
    return {
      loading: true,
      data:[],
      id:"",
      btnShow:false,
      form: {
        title: '',
        url: 'pages/index1/index1',
        publish_time: '',
        send_time: '',
        type: false,
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
        ],
        description: [
          { required: true, message: '文章摘要', trigger: 'blur' }
        ]
      },
    }
  },
  created(){
    this.loading = false;
  },
  mounted(){

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
          var theForm = vm.form
          if(theForm.type){
            theForm.type = 2;
            //theForm.send_time=theForm.send_time.format('yyyy-MM-dd h:m:s')
          }else{
            theForm.type = 1;
            theForm.send_time=''
          }
          theForm.url_id=parseInt(theForm.url_id)
          //theForm.publish_time=theForm.publish_time.format('yyyy-MM-dd h:m:s')
          pushService.saveAdd(theForm).then(data=>{
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
  Date.prototype.format = function(format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
</script>
<style>
  .lineheight20 .el-form-item__label{line-height: 20px;}
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
