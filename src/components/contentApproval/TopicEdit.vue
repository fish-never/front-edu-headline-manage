<template xmlns="http://www.w3.org/1999/html">
  <div  v-loading="loading">
    <div class="search-wrap">
        <span class="mgr20"><router-link to="/index/HotpostList" class="color999">社区管理</router-link>>热帖列表</span>
        <!-- <span class="title">检索条件</span> -->
        <div class="content">
          <div class="topic  positionR">话题:</div>
          <input type="text" placeholder=" #自考怎么学" class="topicinput mgr20">
          <!--<el-input v-model="content" placeholder="话题关键字" clearable class="topicinput mgr20"></el-input>-->
          <div class="topicdec">话题描述:</div>
          <input type="text"  class="topicdecinput mgr20">

          <!--<el-input v-model="username" placeholder="用户名" clearable  class="topicdecinput"></el-input>-->
          <button @click="getSourceList" class="savebutton">保存</button>
          <button @click="getSourceList" class="canclebutton">取消</button>
        </div>
      </div>
    </div>
</template>

<script>
  import publishedService from '../../service/published';
  import commonService from '../../service/common';
  export default {
    name: 'published',
    data() {
      return {
        pageShow:false,
        loading: true,
        page:1,
        total: 10,
        pageNum: 10,
        types:"",
        data:[],
        value:"",
        value2:"2",
        value3:"",
        options:[],
        value2:"",
        options2: [
          {
            value: 1,
            label: '今天'
          }, {
            value: 2,
            label: '近七天'
          }, {
            value: 3,
            label: '近一个月'
          }, {
            value: 4,
            label: '近一年'
          }]
      }
    },
    mounted(){
      if (localStorage.getItem("Token") == null) {
        this.$router.push({ path: "/" });
        return;
      }
      this.loadList();
      publishedService.sourceData().then(data=>{
        if(data.code==0){
          this.options = data.data;
          this.pageShow=true;
        }else{
          this.pageShow=false;
        }
      }),
        commonService.typeList().then(data => {
          if(data.code == 0){
            this.types = data.data;
          }
        })
    },
    methods: {
      loadList(){
        const params = {
          page:this.page,
          pageNum:this.pageNum,
          source:this.value,
          rangeType:this.value2,
          typeId:this.value3
        };
        const loadingInstance = this.$loading({ fullscreen: true });
        publishedService.sourceList(params).then(data=>{
          if(data.code==0){
            loadingInstance.close();
            this.page = parseInt(data.data.page);
            this.pageNum = parseInt(data.data.pageNum);
            this.total = parseInt(data.data.count);
            this.data = data.data.result;
            //  this.data.forEach(item => {
            //     item.come_from = "999999";
            //     item.like_count = "9987454";
            //     item.share_count = "1111";
            //   });
            this.loading = false;
          }else{
            this.open(data.msg)
          }
        })
      },

      updataStatusDown(id,status){
        this.$confirm('确定下架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: id,
            status:2
          };
          publishedService.updataStatus(params).then(data=>{
            if(data.code==0){
              this.loadList()
            }else{
              this.open(data.msg)
            }
          })
        }).catch(() => {
        });

      },

      updataStatusUp(id,status){
        this.$confirm('确定发布?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: id,
            status:0
          };
          publishedService.updataStatus(params).then(data=>{
            if(data.code==0){
              this.loadList()
            }else{
              this.open(data.msg)
            }
          })
        }).catch(() => {
        });

      },
      getSourceList(){
        this.loadList()
      },
      handleSizeChange(val){
        this.pageNum = val;
        this.loadList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.loadList();
      }
    },
    filters: {
      money: function(val) {
        let pattern = /(?=((?!\b)\d{3})+$)/g;
        return val.replace(pattern, ",");
      }
    }
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
  .topicdec{
    font-size: 16px;
    height: 50px;
    width: 70px;
    left: 34px;
    margin-left: 34px;
  }
</style>
