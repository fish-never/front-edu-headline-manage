<template>
  <div  v-loading="loading" id="pushReply">
    <div class="search-wrap">
      <span class="mgr20"><router-link to="/index/publishingPool">推送管理</router-link>>回复推送管理</span>

      <el-input v-model="content" size="small" placeholder="请输入文章标题" clearable class="searchinput mgr20" style="width:150px;"></el-input>
      <button class="search-btn" @click="getSourceList">搜索</button>
    </div>
    <el-table
      :data="itemData"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      class="wrap-margin"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="index"
        label="编号">
      </el-table-column>
      <el-table-column
        label="文章标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回复时间">
        <template slot-scope="scope">
          <span>{{ scope.row.reply_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间" class="table-th">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="pageShow"
                   class="page-wrap"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page"
                   :page-sizes="[10,50,100,200,500,1000,2000,3000]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import pushService from '../../service/push';
  import commonService from '../../service/common';
  export default {
    name: 'pushReply',
    data () {
      return {
        pageShow:false,
        loading: true,
        itemData:[],
        title:'',
        page:1,
        content:'',
        ids:"",
        types:"",
        total: 10,
        pageSize:10,
        options:[],
        value:"",
        value2:2,
        value3:"",
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
      if (localStorage.getItem("account") == null) {
      this.$router.push({ path: "/" });
      return;
    }

      this.replyList()

    },
    methods: {
      //弹框
      open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    //弹框

     handleSelectionChange(val) {
      // console.log(val)
        this.multipleSelection = val;
        this.ids='';
        val.forEach(item=>{
               this.ids = item._id + "," + this.ids;
          })
          this.ids = this.ids.replace(/,$/,'')
           },
      //搜索
      getSourceList(){
        this.page = 1;
        this.replyList()
      },
      //获取列表
      replyList(){
        const params = {
          title:this.content,
          page:this.page,
          pageSize:this.pageSize,
        };
       const loadingInstance = this.$loading({ fullscreen: true });
        pushService.list(params).then(data=>{
          if(data.code==0){
              loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageSize = parseInt(data.data.pageSize);
          this.total = parseInt(data.data.count);
          this.itemData = data.data.list;
       //   console.log(this.itemData)
          this.loading = false;
          this.pageShow=true;
        }else{
            this.open("加载失败，请重试！")
            this.pageShow=false;
            this.loading = false;
        }

      })
      },

      handleSizeChange(val){
        this.pageSize = val;
        this.replyList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.replyList();
      },

    }
  }
</script>

<style scoped lang="scss">

  .link-a:visited{
  color:red;
}
a:visited{
  color:red;
}
.red{
  color:red;
}
  .item-wrap{
    width:290px;
    height:258px;
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    float:left;
    text-align: left;
    margin:20px;
    position:relative;

  .item{
    padding:16px 19px 19px 19px;
  }
  .opera{
    text-align: center;
    color:#96ABB5;
    font-size:14px;
    height:40px;

    border-top:1px solid #EDF1F2;
    position:absolute;
    bottom:0;
    width:100%;
    button{
      border:none;
      background:none;
      width:100%;
      cursor: pointer;
      color:#666;
      &:hover{
         color:#FD782D;
      }
    }
    a{
      display: block;
       &:hover{
         color:#FD782D;
      }
    }

  .el-col{
    height:39px;
    line-height:39px;
  }

  .border-c{
    border-left:1px solid #EDF1F2;
    border-right:1px solid #EDF1F2;
  }
  }
  }
  .title{
    font-size:16px;
    color:rgba(52,71,80,1);
    line-height:22px;
    font-weight:600;
  }
  .tag{
    font-size:12px;
    color:rgba(179,179,179,0.99);
    line-height:12px;
    margin-top:5px;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
    margin:14px 0 21px 0;
  }

</style>
