<template>
  <div>
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池</router-link>>图文文章预览</p>
    <div class="wrap">
      <div class="item">
        <!-- <el-form :model="data" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <p v-text="data.title"></p>
          </el-form-item>
          <el-form-item label="来源" prop="source">
            <p v-text="data.source"></p>
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <p v-text="data.type"></p>
          </el-form-item>
          <el-form-item label="封面" prop="source">
            <p v-text="data.source"></p>
          </el-form-item>
            <el-form-item  prop="content">
            <p v-html="data.content_html"></p>
          </el-form-item>
        </el-form>
        <button class="btn" @click="publishData">发布</button>
        <router-link  :to="{path:'/index/operationEdit/'+data._id}" class="btn">编辑</router-link> -->

        <h2 class="title">{{data.title}}</h2>
        <p class="tag"><span>{{data.info_name}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <div class="text" v-html="data.content_html"></div>
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
        data:[],
        id:"",
      }
    },
    created(){
      this.id = this.$route.query.id
      console.log(this.id)
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
      operationService.detailData(this.id).then(data=>{
        if(data.code==0){
        this.data = data.data;
        console.log(this.data)
      }else{
        this.open(data.msg)
      }
    })

    }

  }
</script>

<style scoped>


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
