<template>
  <div>
    <p class="location"><router-link to="/index/versions" class="grey">版本管理</router-link>>新增</p>
    <div class="wrap-margin wrap-padding">
      <el-form :model="data" label-width="120px" class="demo-ruleForm" :rules="rules" >
        <el-form-item label="版本号" prop="version">
          <el-col :span="11">
            <el-input v-model="data.version"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否处于审核" prop="status">
           <el-radio v-model="data.status" label="0">0</el-radio>
            <el-radio v-model="data.status" label="1">1</el-radio>
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
        status:0,
        data:{
          remark:'',
          version:'',
          status:0
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
        versionsService.add(this.data).then(data=>{
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

    },
  }
</script>

<style scoped>

</style>
