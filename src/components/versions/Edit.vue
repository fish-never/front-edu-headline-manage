<template>
  <div>
    <p class="location"><router-link to="/index/versions" class="grey">版本管理</router-link>>编辑</p>
    <div class="wrap-margin wrap-padding">
      <el-form :model="data" label-width="180px" class="demo-ruleForm" :rules="rules" >
        <el-form-item label="版本号" prop="version">
          <el-col :span="11">
            <el-input v-model="data.version"  placeholder="例如版本号2.0.1,此处填写为20001"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否处于审核" prop="isCheck">
          <el-radio v-model="data.status.isCheck" label="1">是</el-radio>
          <el-radio v-model="data.status.isCheck" label="0">否</el-radio>
        </el-form-item>
         <el-form-item label="是否关闭分享活动入口" prop="openShare" v-if="data.flag==2">
          <el-radio v-model="data.status.openShare" label="1">是</el-radio>
          <el-radio v-model="data.status.openShare" label="0">否</el-radio>
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
        id:'',
        btnShow:false,
        status:0,
        data:{
          remark:'',
          version:'',
          status:0,
          flag:1
        },
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
  created() {
    this.id = this.$route.params.id;
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
        let params = {
          remark:this.data.remark,
          version:this.data.version,
          status:JSON.stringify(this.data.status),
          id:this.data.id
        };
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
        versionsService.update(params).then(data=>{
          console.log(data)
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
      let params = {
        id: this.id
      }
      versionsService.getInfo(params).then(data => {
        this.data = data.data;
        status = this.data.status;
        if( status.indexOf('isCheck')>= 0){
            this.data.status = JSON.parse(this.data.status)
             this.data.flag = 2;
        }else{
             this.data.status = {"isCheck":this.data.status,"openShare":'0'}
             this.data.flag = 1;
        }

      })

    },
  }
</script>

<style scoped>
.location {
    padding-left: 20px;
}
</style>
