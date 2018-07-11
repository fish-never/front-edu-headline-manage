<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div class="search-wrap">
      <span class="mgr20"><router-link to="/index/HotpostList" class="color999">社区管理</router-link>>话题管理</span>
      <!-- <span class="title">检索条件</span> -->
      <div class="topicTitleContent" >
        <div class="titleText">
          <p class="topicTitle">{{title_data.name}}</p>
          <p class="topicDesc">{{title_data.description}}</p>
          <p class="topicDesc">{{title_data.created_at}}</p>
          <button class="search-btn" @click="edit">编辑</button>
        </div>
      </div>
      <div class="content" v-for="item in list_data.result" :key="item.id">
        <img src="../../assets/imgs/avatar.svg" class="avatar">
        <p class="userName">Lee</p>
        <p class="createdAt">{{item.created_at}}</p>
        <button class="close" @click="deleteDetail(item.id)"></button>
        <p class="contentTitle">#zikaozenmexue#</p>
        <p class="paragraph">{{item.content.content}}</p>
        <img v-for="image in item.content.images" :src='image' class="img">
        <br/>
        <div class="functionContent">
          <div class="function">
            <img src="../../assets/imgs/comment.svg" class="icon">
            <p class="num">{{item.comment_count}}</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/prise.svg" class="icon">
            <p class="num">{{item.like_count}}</p>
          </div>
          <div class="function">
            <img src="../../assets/imgs/share.svg" class="icon">
            <p class="num">{{item.share_count}}</p>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,50,100,200,500,1000,2000,3000]"
      :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import topicManageService from '../../service/topicManage';
  import commonService from '../../service/common';

  export default {
    name: 'published',
    // props:['ids'],
    data() {
      return {
        id: this.ids,
        topicEdit:{
          topicName:'',
          topicDesc:''
        },
        // comment_count: 0,
        // like_count: 2,
        // read_count: 2,
        // share_count: 2,
        // created_at: '',
        // content: '',
        // images: []
        list_data:{},
        title_data:{},
        total: 10,
        page: 1,
        pageNum: 10,
        topicId: 0
      }
    },

    created: function () {
      this.loadList();
      this.loadTopicDesc();
    },
    // mounted() {
    //   if (localStorage.getItem("Token") == null) {
    //     this.$router.push({ path: "/" });
    //     return;
    //   }
    //   this.loadList();
    // },
    methods: {
      handleSelectionChange(val) {
        // console.log(val)
        this.multipleSelection = val;
        this.ids='';
        val.forEach(item=>{
          this.ids = item._id + "," + this.ids;
        });
        this.ids = this.ids.replace(/,$/,'')
      },
      getPage(num){
        this.page = num;
        this.loadList()
      },
      getPageNum(num){
        this.pageNum = num;
        this.loadList()
      },
      getSourceList(){
        this.page = 1;
        this.loadList()
      },
      //加载话题描述
      loadTopicDesc(){
        const params = {
          id: 12
        };
        topicManageService.topicTitleDesc(params).then(data=>{
          if(data.code === 0){
            this.title_data = data.data;
            console.log(this.title_data)
          } else {
            console.log('err')
          }
        })
      },
      //加载页面
      loadList(){
        const params = {
          page:this.page,
          pageNum:this.pageNum,
          topic_id:12
        };
        console.log('loaded!');
        const loadingInstance = this.$loading({ fullscreen: true });
        topicManageService.view(params).then(data=>{
          if(data.code === 0){
            loadingInstance.close();
            this.page = parseInt(data.data.page);
            this.pageNum = parseInt(data.data.pageNum);
            this.total = parseInt(data.data.count);
            this.list_data = data.data;
            // this.itemData = data.data.result;
            //   console.log(this.itemData)
            // this.loading = false;
            // this.pageShow=true;
          }
          // else{
          //   this.open("加载失败，请重试！")
          //   this.pageShow=false;
          //   this.loading = false;
          // }
        })
      },
      //删除
      deleteDetail(id) {
        const ids = parseInt(id);
        console.log(ids);
        let params = {
          ids: parseInt(id)
        };
        this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // topicManageService.deletePost(ids);
          topicManageService.deletePost(params).then(data=>{
            if (data.code === 0){
              console.log(data);
              console.log(ids);
              this.loadList();
            } else {
              console.log('err!');
              console.log(ids)
            }
          });
        })
      },
      handleSizeChange(val){
        this.pageNum = val;
        this.loadList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.loadList();
      },
      //跳转编辑页面
      edit(){
        this.$router.push({ path: "/index/TopicEdit",query:{id:this.topicId}});
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
  .search-btn{
    width: 70px;
    height: 32px;
    position: relative;
    left: 750px;
    top: -50px;
  }
</style>
