<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div class="search-wrap inline">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index/contentApproval/HotpostList' }">社区管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/index/contentApproval/TopicManage' }">话题管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}话题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
      <div class="content">
        <div class="topic  positionR">话题:</div>
        <el-input class="topicinput mgr20"
          placeholder="#自考怎么学"
          v-model="topicEdit.name"
          :disabled="canEdit">
        </el-input>
               <!--<el-input v-model="content" placeholder="话题关键字" clearable class="topicinput mgr20"></el-input>-->
        <div class="topicdesc">话题描述:</div>
        <!--<input type="text"  class="topicdecinput mgr20" v-model="topicEdit.topicDesc">-->
        <el-input  class="topicdecinput mgr20"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="topicEdit.description">
        </el-input>

        <!--<el-input v-model="username" placeholder="用户名" clearable  class="topicdecinput"></el-input>-->
        <button @click="saveData" class="savebutton">保存</button>
        <button class="canclebutton" @click="gotoManage()">取消</button>
      </div>
    </div>
</template>

<script>
  import topicManageService from '../../service/topicManage';
  import postList from "../../service/postList"; //控制器
  import commonService from '../../service/common';

  export default {
    name: 'published',
    data() {
      return {
        canEdit:true,
        loading: true,
        topicEdit:{
          name:'',
          description:''
        },
       title:'',

        topicId: this.$route.query.id
      }
    },
    mounted(){
      if(this.topicId&&this.topicId!=''){
        this.title='编辑'
        this.canEdit=true
        this.viewTopic()
      }else{
        this.title='新增'
        this.canEdit=false
      }

    },
    methods: {
      //弹框
      open(text) {
        this.$alert(text, "信息", {
          confirmButtonText: "确定"
        });
      },
      //跳转
      gotoManage(){
        this.$router.push({path: '/index/contentApproval/TopicManage'});
      },
      //根据id获取详情
      viewTopic(){
        const params = {
          id:this.topicId,
        };
        const loadingInstance = this.$loading({ fullscreen: true });
        const vm = this
        postList.viewTopic(params).then(data=>{
          if(data.code==0){
            const rdata = data.data
            loadingInstance.close();
            vm.topicEdit = rdata
            vm.loading = false;
            vm.pageShow=true;
          }else{
            vm.open("加载失败，请重试！")
            vm.pageShow=false;
            vm.loading = false;
          }
        })
      },
      //编辑新增话题
      saveData(){
        const loadingInstance = this.$loading({ fullscreen: true });
        const vm = this
        if(this.topicId&&this.topicId!=''){
          const params = {
            id:this.topicId,
            description:this.topicEdit.description
          };
          postList.editTopic(params).then(data=>{
            if(data.code==0){
              const rdata = data.data
              loadingInstance.close();
              vm.loading = false;
              vm.pageShow=true;
              this.$router.push({path: '/index/contentApproval/TopicManage'});
            }else{
              vm.open("修改失败，请重试！")
              loadingInstance.close();
              vm.pageShow=false;
              vm.loading = false;
            }
          })
        }else{
          const params = {
            name:this.topicEdit.name,
            description:this.topicEdit.description
          };
          postList.addTopic(params).then(data=>{
            if(data.code==0){
              const rdata = data.data
              loadingInstance.close();
              vm.loading = false;
              vm.pageShow=true;
              this.$router.push({path: '/index/contentApproval/TopicManage'});
            }else{
              vm.open("新增失败，请重试！")
              loadingInstance.close();
              vm.pageShow=false;
              vm.loading = false;
            }
          })
        }
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
    position: relative;
    left: 114px;
    top: -13px;
  }
  .color999{
    color: #999999;
  }
  .topicdecinput{
    width: 450px;
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
