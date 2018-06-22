<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div class="search-wrap">
      <span class="mgr20"><router-link to="/index/HotpostList" class="color999">社区管理</router-link>>话题管理</span>
      <!-- <span class="title">检索条件</span> -->
      <div class="topicTitleContent">
        <div class="titleText">
          <p class="topicTitle">#zikaozenmexue#</p>
          <p class="topicDesc">#zikaozenmexue#</p>
          <p class="topicDesc">#zikaozenmexue#</p>
        </div>
      </div>
      <div class="content">
        <img src="../../assets/imgs/avatar.svg" class="avatar">
        <p class="userName">Lee</p>
        <p class="createdAt">12H</p>
        <button class="close" @click="deleteDetail"></button>
        <p class="contentTitle">#zikaozenmexue#</p>
        <p class="paragraph">教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且</p>
        <img src="../../assets/imgs/img.png" class="img">
        <img src="../../assets/imgs/img.png" class="img">
        <br/>
        <div class="functionContent">
          <div class="function">
            <img src="../../assets/imgs/comment.svg" class="icon">
            <p class="num">1270</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/prise.svg" class="icon">
            <p class="num">3240</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/share.svg" class="icon">
            <p class="num">5482</p>
          </div>
        </div>
      </div>

      <div class="content">
        <img src="../../assets/imgs/1.jpg" class="avatar">
        <p class="userName">Lee</p>
        <p class="createdAt">12H</p>
        <p class="contentTitle">#zikaozenmexue#</p>
        <p class="paragraph">教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且教育部发出了最新消息，中考将要改革，并且</p>
        <img src="../../assets/imgs/img.png" class="img">
        <img src="../../assets/imgs/img.png" class="img">
        <br/>
        <div class="functionContent">
          <div class="function">
            <img src="../../assets/imgs/comment.svg" class="icon">
            <p class="num">1270</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/prise.svg" class="icon">
            <p class="num">3240</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/share.svg" class="icon">
            <p class="num">5482</p>
          </div>
        </div>
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
        id: 0,
        topicEdit:{
          topicName:'',
          topicDesc:''
        },
        // touxiang:require("../../assets/imgs/userimg1.png")
      }
    },
    // created: function () {
    //   $.ajax({
    //     method: 'post',
    //     url: 'http://zhangyu.toutiao-manage-api.com/topic/operate/update-info',
    //     headers:{
    //       'Authorization': token
    //     },
    //     data:{
    //       id: id,
    //       name :name,
    //       description: description
    //     }
    //
    //   })
    // },
    methods: {
      deleteDetail: function () {
        console.log("delete!");
        let id = 12;
        topicManageService.deletePost(id).then(data=>{
          if (data.code === 0){
            console.log(data);
            console.log(id)
          } else {
            console.log('err!');
            console.log(id)
          }
        })
      }


    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .color999{
    color: #999999;
  }
  .topicTitle{
    color: #FD782D;
    font-size: 22px;
  }
  .topicDesc{
    color: #FFFFFF;
    font-size: 14px;
    margin-top: 7px;
  }
  .topicTitleContent{
    height: 104px;
    width: 900px;
    margin-top: 20px;
    background-image: url("../../assets/imgs/topictitlebg.png");
  }
  .content{
    width: 900px;
    height: auto;
    background-color: white;
    margin-top: 16px;
  }
  .userName{
    color: #333333;
    font-size: 16px;
    float: left;
    margin-top: 32px;
    margin-left: 10px;
  }
  .createdAt{
    color: #999999;
    font-size: 12px;
    float: left;
    margin-top: 57px;
    margin-left: -28px;
  }
  .avatar{
    height: 50px;
    width: 50px;
    margin-left: 35px;
    margin-top: 32px;
    float: left;
  }
  .contentTitle{
    color: #FD782D;
    font-size: 18px;
    clear: both;
    margin-left: 42px;
    padding-top: 17px;
  }
  .paragraph{
    width: 791px;
    height: auto;
    font-size: 14px;
    color: #666666;
    margin-left: 44px;
    margin-top: 7px;
  }
  .img{
    height: 150px;
    width: 300px;
    margin-left: 44px;
    margin-top: 23px;
    margin-right: -14px;
  }
  .icon{
    height: 20px;
    width: 20px;
    color: #202020;
    float: left;
  }
  .function{
    float: left;
    margin-left: 106px;
    margin-right: 120px;
    padding-bottom: 25px;
  }
  .functionContent{
    height: 30px;
    margin-top: 25px;
    margin-bottom: 25px;
  }
  .num{
    float: left;
    line-height: 20px;
  }
  .titleText{
    margin-left: 32px;
    padding-top: 14px;
  }
  .close{
    background-image: url("../../assets/imgs/deleteicon.svg");
    height: 17px;
    width: 17px;
    float: right;
    margin-top: 30px;
    margin-right: 30px;
    background-color: white;
  }
</style>
