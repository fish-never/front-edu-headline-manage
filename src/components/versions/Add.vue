<template>
  <div>
    <p class="location"><router-link to="/index/versions" class="grey">版本管理</router-link>>新增</p>
    <div class="wrap-margin wrap-padding">
      <el-form :model="data" label-width="180px" class="demo-ruleForm" :rules="rules" >
        <el-form-item label="版本号" prop="version">
          <el-col :span="11">
            <el-input v-model="data.version" placeholder="例如版本号2.0.1,此处填写为20001"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="打卡排行" prop="isCheck">
          <el-radio v-model="data.isCheck" label="1">开启</el-radio>
          <el-radio v-model="data.isCheck" label="0">关闭</el-radio>
        </el-form-item>
         <el-form-item label="朋友圈分享" prop="openShare">
          <el-radio v-model="data.openShare" label="1">开启</el-radio>
          <el-radio v-model="data.openShare" label="0">关闭</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="11">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="data.remark">
            </el-input>
          </el-col>

        </el-form-item>
        <el-form-item>
          <button @click="textSaveData"  type="button" class="btn"  v-if="!btnShow">保存</button>
          <button class="gray-btn" type="button" v-if="btnShow">正在保存</button>
          <button @click="cancel"  type="button" class="btn" >取消</button>

        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import versionsService from '../../service/version';
  export default {
    name: 'opedit',
    data () {
      return {
        btnShow:false,
        data:{
          remark:'',
          version:'',
          isCheck:"0",
           openShare:"0",
          // status:{"isCheck":'0',"openShare":"0"}
        },
        isCheck:"0",
        openShare:"0",
        rules: {
          version: [
            { required: true, message: '请输入版本号', trigger: 'blur' },
          ],
          status: [
            { required: true, message: '请选择是否处于审核', trigger: 'change' }
          ]
        }
      }
      
    },

    methods:{
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      cancel(){
        this.$router.push({ path: "../../index/versions"})
      },
      // 保存
      textSaveData(){
        this.btnShow = true;
        console.log(this.data)
        if(this.data.version==""){
          this.open("请输入版本号");
          this.btnShow = false;
          return
        }
        if(this.data.status==""){
          this.btnShow = false;
          this.open("请选择是否处于审核")
          return
        }
        let  status=JSON.stringify({"isCheck":this.data.isCheck,"openShare":this.data.openShare});
        let params = {
          remark:this.data.remark,
          version:this.data.version,
          status:status,
        };
        console.log(params)

        versionsService.add(params).then(data=>{
         if(data.code==0){
            this.$router.push({ path: "../../index/versions"})
          }else{
            this.btnShow = false;
            this.open(data.msg)
          }
      })

      },

    },
    mounted(){

    },
  }
</script>

<style scoped>
.location {
    padding-left: 20px;
}
.span-grey{
  float:left;
  margin-left:20px;
  color:#666;
}
</style>
