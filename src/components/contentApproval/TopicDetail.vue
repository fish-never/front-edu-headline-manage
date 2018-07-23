<template xmlns="http://www.w3.org/1999/html">
  <div>

      <div class="search-wrap inline">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index/contentApproval/HotpostList' }">社区管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/index/contentApproval/TopicManage' }">话题管理</el-breadcrumb-item>
          <el-breadcrumb-item>话题详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
            <!-- <span class="title">检索条件</span> -->
      <div class="topicTitleContent search-wrap" >
        <div class="titleText">

          <p class="topicTitle">{{title_data.name}}</p>
          <p class="topicDesc">{{title_data.description}}</p>
          <p class="topicDesc">{{title_data.created_at}}</p>
          <button class="search-btn"  @click="gotoEdit(title_data.id)">编辑</button>
        </div>
      </div>
      <div class="content search-wrap" v-for="item in list_data.result" :key="item.id">
        <div class="td-t">
        <img :src="item.thumb_img" class="avatar">
        <div class="detail-lj">
        <p class="userName">{{item.nickname}}</p>
        <p class="createdAt">{{item.created_at}}</p>
        </div>
        <button class="close" @click="deleteDetail(item.id)"></button>
        </div>
        <p class="contentTitle">#{{title_data.name}}#</p>
        <p class="paragraph">{{item.content.content}}</p>
        <!--<img v-for="image in item.content.images" :src='image' class="img">-->
        <div class="img-div">
          <div class="img-div-inner" v-for="image in item.content.images" :key="image.id"><img :src="image" ></div>
        </div>

        <div class="functionContent">
          <div class="function">
            <div class="div-all">
              <div class="div-icon-img"><img src="../../assets/imgs/comment.svg" class="icon"></div>
              <el-input size="mini" :disabled="true" class="input-icon" v-model="item.comment_count" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="function">
            <div class="div-all">
              <div class="div-icon-img"><img src="../../assets/imgs/prise.svg" class="icon"></div>
              <el-input size="mini" class="input-icon" @change="updateNum(item)" v-model="item.like_count" placeholder=""></el-input>
            </div>
          </div>
          <div class="function">
            <div class="div-all">
              <div class="div-icon-img"><img src="../../assets/imgs/share.svg" class="icon"></div>
              <el-input size="mini" class="input-icon" @change="updateNum(item)" v-model="item.share_count" placeholder=""></el-input>
            </div>
          </div>
        </div>
      </div>
    <div class="search-wrap">
    <el-pagination
      class="page-wrap"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,50,100,200,500,1000,2000,3000]"
      :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
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
        topicId: this.$route.query.id
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
      //弹框
      open(text) {
        this.$alert(text, "信息", {
          confirmButtonText: "确定"
        });
      },
      //跳转编辑页
      gotoEdit(tid){
        this.$router.push({path: '/index/TopicEdit',query:{ id:tid}});
      },
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
          id: this.topicId
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
          topic_id:parseInt(this.topicId)
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
      //修改点赞数
      updateNum(rowdata){
        const params = {
          id:parseInt(rowdata.id),
          comment_count:parseInt(rowdata.comment_count),
          like_count:parseInt(rowdata.like_count),
          share_count:parseInt(rowdata.share_count),
          read_count:parseInt(rowdata.read_count),
          is_hot:parseInt(rowdata.is_hot),
          weight:parseInt(rowdata.weight),
        };
        const loadingInstance = this.$loading({ fullscreen: true });
        const vm = this
        topicManageService.updateNum(params).then(data=>{
          if(data.code==0){
            const rdata = data.data
            loadingInstance.close();
            if(rdata.result==1){
              vm.open("修改成功")
            }
            vm.loading = false;
            vm.pageShow=true;
          }else{
            vm.open("修改失败，请重试！")
            loadingInstance.close();
            vm.pageShow=false;
            vm.loading = false;
          }
        })
      },
      //删除
      deleteDetail(id) {
        //const ids = parseInt(id);
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
              this.loadList();
            } else {
              vm.open("删除失败，请重试！")
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
  .input-icon{width:100px;height:25px!important;line-height: 25px!important;float:left}
  .img-div{display:flex;margin-top:15px;}
  .img-div-inner{flex:1;margin-right:20px;height:150px;overflow: hidden;}
  .img-div-inner:last-child{margin:0;}
  .img-div-inner img{width:100%;}
  .bg-img{width:100%;height:100%;}
  .td-t{overflow: hidden;margin-bottom:15px;position:relative}
  .detail-lj{float:left;margin-left:18px;}
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


  }
  .input-icon{
    padding:0 8px;
  }
  .content{
    padding:20px 34px;
    height: auto;
    background-color: white;
    margin-top: 16px;
  }
  .userName{
    color: #333333;
    font-size: 16px;
line-height: 30px;
  }
  .createdAt{
    color: #999999;
    font-size: 12px;
    line-height: 20px;
  }
  .avatar{
    height: 50px;
    width: 50px;
    float: left;
    border-radius: 50%;
  }
  .contentTitle{
    color: #FD782D;
    font-size: 18px;
    margin-bottom: 5px;
  }
  .paragraph{
    font-size: 14px;
    color: #666666;
line-height: 24px;
  }
  .div-all{
    width:150px;
    overflow: hidden;margin:0 auto;}
  .img{
    height: 150px;
    width: 300px;
    margin-left: 44px;
    margin-top: 23px;
    margin-right: -14px;
  }
  .div-icon-img{
    width:30px;
    float:left;
  }
  .icon{
    height: 25px;
    width: 25px;
    color: #202020;
    margin-top:2px;
  }
  .function{
    flex:1;
    text-align: center;
  }
  .functionContent{
    display: flex;
    margin-top:35px;
  }
  .num{
    float: left;
    line-height: 20px;
  }
  .titleText{
    background: url("../../assets/imgs/line.jpg") repeat;
    //background-size:100%;
    padding:15px 34px;
    position:relative;
  }
  .close{
    background-image: url("../../assets/imgs/deleteicon.svg");
    height: 17px;
    width: 17px;
    position:absolute;
    top:0;
    right:0;
    background-color: white;
  }
  .search-btn{
    width: 70px;
    height: 32px;
    position: absolute;
right:34px;top:50%;margin-top:-16px;
  }
</style>
