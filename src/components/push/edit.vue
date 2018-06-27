<template>
<div  v-loading="loading" class="pushedit">
  <div class="search-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>推送管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">运营推送管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑推送</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="search-wrap" style="width:600px;">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="文章标题"  prop="title">
        <el-input v-model="form.title" maxlength="35"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" required  class="datetime">
        <el-form-item prop="data1">
          <el-date-picker format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          v-model="form.data1"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="time1">
          <el-time-select
            v-model="form.time1" format="h时m分s秒"
            value-format="yyyy-MM-dd h:m:s"
            :picker-options="{
    start: '00:00',
    step: '00:01',
    end: '23:55'
  }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="文章摘要" prop="description">
        <el-input type="textarea" v-model="form.description" maxlength="75"></el-input>
      </el-form-item>
      <el-form-item label="open ID" prop="openids">
        <el-input v-model="form.openids"></el-input>
      </el-form-item>

      <el-form-item label="进入小程序查看的位置" class="lineheight20" prop="url">
        <el-select v-model="url" placeholder="请选择进入小程序查看的位置">
          <el-option label="小程序首页" value="小程序首页">小程序首页</el-option>
          <el-option label="文章详情页" value="文章详情页">文章详情页</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章ID" v-if="url=='文章详情页'" prop="url_id">
        <el-input v-model="form.url_id"></el-input>
      </el-form-item>
      <el-form-item label="定时发送" >
        <el-switch v-model="type"></el-switch>
      </el-form-item>

      <el-form-item label="" v-if="type==true" class="datetime">
        <el-form-item prop="data2">
          <el-date-picker format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          v-model="form.data2"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="time2">
          <el-time-select
            v-model="form.time2" format="h时m分s秒"
            value-format="yyyy-MM-dd h:m:s"
            :picker-options="{
    start: '00:00',
    step: '00:05',
    end: '23:55'
  }"
            placeholder="选择时间">
          </el-time-select>
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
      type:false,
      url:'小程序首页',
      form: {
        title: '',
        url: 'pages/index1/index1',
        publish_time: '',
        send_time: '',
        type: 1,
        url_id: '0',
        openids:'',
        description:'',
        time1:'',
        data1:'',
        time2:'',
        data2:'',
      },
      rules: {
        title: [
          { required: true, message: '文章标题', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请选择进入小程序查看的位置',trigger: 'change'}
        ],
        publish_time: [
          { type: 'date', required: true, message: '请选择时间',trigger: 'change'}
        ],
        send_time: [
          { type: 'date', required: true, message: '请选择时间',trigger: 'change'}
        ],
        url_id:[
          {  required: true, message: '请输入文章ID', trigger: 'blur' }
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
    const theId = this.$route.query.id
    this.getDetail(theId)
  },
  methods:{
    //弹框
    open(text) {
      this.$alert(text, '信息', {
        confirmButtonText: '确定',
      });
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        var vm = this
        if (valid) {
          if(vm.url=="文章详情页"){
            if(vm.form.url_id==0){
            this.open("文章ID不能为0");
            return false;
            }
          }

          vm.form.url="pages/index1/index1"
          vm.form.publish_time=vm.form.data1+' '+vm.form.time1
          vm.form.send_time=vm.form.data2+' '+vm.form.time2
          //var theForm = vm.form
          if(vm.type){
            vm.form.type = 2;
          }else{
            vm.form.type = 1;
            vm.form.send_time=''
          }
          if(vm.url=="小程序首页"){
            vm.form.url_id=0
          }
          vm.form.url_id=parseInt(vm.form.url_id)
          pushService.update(vm.form).then(data=>{
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

    },
    getDetail(tid){
      const vm =this
      const params = {
        id:parseInt(tid),
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      pushService.getDetail(params).then(data=>{
        if(data.code==0){
          const rdata=data.data
          loadingInstance.close();
          const datetime1=rdata.publish_time.split(" ")
          rdata.data1=datetime1[0]
          rdata.time1=datetime1[1]
          if(rdata.type==1){
            vm.type=false
            rdata.send_time=''
          }else{
            vm.type=true
            const datetime2=rdata.send_time.split(" ")
            rdata.data2=datetime2[0]
            rdata.time2=datetime2[1]
          }
          if(rdata.url_id&& rdata.url_id!=''&&rdata.url_id!=0){
            vm.url="文章详情页"
          }else{
            vm.url="小程序首页"
          }
          vm.form=rdata
        }else{
          vm.open("推送失败，请重试！")
          this.pageShow=false;
          this.loading = false;
        }

      })
    },

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
  .pushedit .datetime .el-form-item{float:left;margin-right:20px;}
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
