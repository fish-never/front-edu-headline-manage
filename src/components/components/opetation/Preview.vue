<template>
  <div>
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池</router-link>>预览</p>
    <div class="wrap">
      <div class="item">
        <el-form :model="data" label-width="90px" class="demo-ruleForm">
          <el-form-item label="标题：" prop="title">
            <p v-text="data.title"></p>
          </el-form-item>
          <el-form-item label="来源：" prop="source">
            <p v-text="data.source"></p>
          </el-form-item>
          <el-form-item label="原始链接：" prop="origin_link">
            <p v-text="data.origin_link"></p>
          </el-form-item>
          <el-form-item label="分类：" prop="type_name">
            <p v-text="data.type_name"></p>
          </el-form-item>
          <el-form-item label="标签：" prop="tag">
            <p v-text="data.tag"></p>
          
          </el-form-item>
          <el-form-item label="封面：" prop="coverage" >
            <p v-if="display_type == 1" >无图模式</p>
           <img :src="data.coverage" v-if="display_type != 5 && display_type != 1 "  class="img-wrap"/>
           <img v-for="item in coverList" :key="item" :src="item" v-if="display_type == 5"  class="img-wrap" /> 
          </el-form-item>

          <el-form-item  prop="content" class="wrap-html">
            <div v-html="data.content_html" ></div>
          </el-form-item>
        </el-form>
        <button class="btn" @click="publishData">发布</button>
        <router-link  :to="{path:'/index/operationEdit/'+data.id}" class="btn">编辑</router-link>
      </div>

    </div>

  </div>
</template>

<script>
  import operationService from '../../service/operation';
  export default {
    name: 'preview',
    data () {
      return {
        display_type:"",
        data:{},
        id:"",

        coverList:[]
      }
    },
    created(){
        this.id = this.$route.params.id
      console.log(this.id)
    },
    computed:{

    },
    methods:{
       open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      publishData(){
      const params = {
        id: this.id
      };
      operationService.publishData(params).then(data=>{
        if(data.data.code==0){
         this.$router.push({path:'../../index/operationStorage'});

      }else{
          this.open(data.data.msg)
      }
    })
      }

    },
    mounted(){
    if (localStorage.getItem("account") == null) {
          this.$router.push({ path: "/" });
          return;
        }
      const param = {
        id:this.id
      }
      operationService.detailData(param).then(data=>{
        if(data.code==0){
        this.data = data.data;
        this.display_type = this.data.display_type;
        
        console.log(this.data)
        if(this.data.display_type == 5){
         this.coverList = this.data.coverage.split(",");
        }
      
        console.log(this.data)
      }else{
        this.open(data.msg)
      }
    })

    }

  }
</script>

<style scoped>
.wrap-html{
  border-radius:1px;
  border:1px solid rgba(150,171,181,0.2);
  padding:26px;
  margin-bottom:40px;
  font-size:16px;
}
  .img-wrap{
    width:94px;
    height:60px;
    display: inline-block;
    margin-right:10px;
  }
  .wrap{
    /*display: table-cell;*/
    /*overflow-y: scroll;*/
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    text-align: left;
    margin:0 20px 20px 20px ;
    padding:2px 23px 0 14px;
  }
  .item{
    padding:54px 63px;
  }
  .title{
    font-size:24px;
    color:#333;
    line-height:25px;
  }
  .tag{
    font-size:12px;
    color:#B3B3B3;
    line-height:12px;
    margin:19px 0 39px 0;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
    margin-bottom:30px;
  }
  .btn,.publish-btn{
    width:100px;
    height:36px;
    background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
    border-radius: 4px ;
    color:#fff;
    font-size:16px;
    display: block;
    text-align: center;
    line-height: 36px;
  }
  .publish-btn{
    background:none;
    color:#FD782D;
    margin-left:30px;
    border:1px solid #FB745F;

  }
</style>
