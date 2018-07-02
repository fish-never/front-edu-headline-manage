<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div class="search-wrap">
      <span class="mgr20"><router-link to="/index/HotpostList" class="color999">社区管理</router-link>>热帖列表</span>
      <!-- <span class="title">检索条件</span> -->
      <div class="content">
        <div class="topic  positionR">话题:</div>
        <input type="text" placeholder=" #自考怎么学" class="topicinput mgr20" v-model="topicEdit.topicName">
        <!--<el-input v-model="content" placeholder="话题关键字" clearable class="topicinput mgr20"></el-input>-->
        <div class="topicdesc">话题描述:</div>
        <!--<input type="text"  class="topicdecinput mgr20" v-model="topicEdit.topicDesc">-->
        <textarea type="text"  class="topicdecinput mgr20" v-model="topicEdit.topicDesc"></textarea>
        <!--<el-input v-model="username" placeholder="用户名" clearable  class="topicdecinput"></el-input>-->
        <button @click="saveData" class="savebutton">保存</button>
        <button class="canclebutton">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  import topicManageService from '../../service/topicManage';
  import commonService from '../../service/common';

  export default {
    name: 'published',
    data() {
      return {
        topicEdit:{
          topicName:'',
          topicDesc:''
        },
        page: 1,
        pageNum: 10,
        topicId: this.$route.query.id
      }
    },

    // mounted(){
    //   if (localStorage.getItem("Token") == null) {
    //     this.$router.push({ path: "/" });
    //     return;
    //   }
    //   this.loadList();
    //   publishedService.sourceData().then(data=>{
    //     if(data.code==0){
    //       this.options = data.data;
    //       this.pageShow=true;
    //     }else{
    //       this.pageShow=false;
    //     }
    //   }),
    //     commonService.typeList().then(data => {
    //       if(data.code == 0){
    //         this.types = data.data;
    //       }
    //     })
    // },
    methods: {

      saveData(){
        var token = localStorage.getItem('Token');


        let id = this.topicId;
        let name = this.topicEdit.topicName.toString();
        let  description = this.topicEdit.topicDesc.toString();

        const updateData = {
          id: id,
          name :name,
          description: description
        };
        console.log(updateData);
        console.log(this.topicId);


        // $.ajax({
        //   method: 'post',
        //   url: 'http://zhangyu.toutiao-manage-api.com/topic/operate/update-info',
        //   headers:{
        //     'Authorization': token
        //   },
        //   data:{
        //     id: id,
        //     name :name,
        //     description: description
        //   }
        //
        // })

        topicManageService.updateInfo(updateData).then(data=>{
          if(data.code===0){
            console.log(data)
          }else{
            console.log('err')
          }
        })
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .link-a:visited{
    color:red;
  }
  a:visited{
    color:red;
  }
  .positionR{
    position: relative;
    top: 40px;
    left: 34px;
  }
  .topicinput{
    width: 450px;
    height: 30px;
    border: 1px solid #E5E5E5;
    position: relative;
    left: 114px;
    top: -13px;
  }
  .color999{
    color: #999999;
  }
  .topicdecinput{
    width: 450px;
    height: 114px;
    border: 1px solid #E5E5E5;
    position: relative;
    left: 114px;
    top: -50px;
  }
  .savebutton{
    width: 100px;
    height: 36px;
    background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
    border-radius: 4px ;
    font-size:16px;
    color:rgba(255,255,255,1);
    line-height:14px;
    cursor: pointer;
    position: relative;
    top: 62px;
    left: -342px;
  }
  .canclebutton{
    width: 100px;
    height: 36px;
    background:white;
    border-radius: 4px ;
    font-size:16px;
    color:rgba(255,255,255,1);
    border: 1px solid #FD782D;
    color: #FD782D;
    line-height:14px;
    margin-left:20px;
    cursor: pointer;
    position: relative;
    left: -330px;
    top: 62px;
  }
  .content{
    background-color: white;
    width: 1100px;
    height: 345px;
    margin-top: 27px;
  }
  .topic{
    font-size: 16px;
    height: 50px;
    width: 70px;
    left: 64px;
  }
  .topicdesc{
    font-size: 16px;
    height: 50px;
    width: 70px;
    left: 34px;
    margin-left: 34px;
    text-wrap: normal;
  }
</style>
