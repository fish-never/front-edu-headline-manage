<template>
  <div class="push" v-loading="loading" id="pushIndex">
    <div class="search-wrap inline clearfloat">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>成长计划</el-breadcrumb-item>
        <el-breadcrumb-item>计划列表</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link class="detele-btn" :to="{path:'/index/plan/add'}">新增</router-link>
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
        label="编号"
        width="60">
      </el-table-column>
      <el-table-column
        label="图标(全部)"
        width="">
        <template slot-scope="scope">
          <img :src="scope.row.icon" class="icon-img" />
        </template>
      </el-table-column>
      <el-table-column
        label="图标(用户)"
        width="">
        <template slot-scope="scope">
          <img :src="scope.row.user_icon" class="icon-img" />
        </template>
      </el-table-column>
      <el-table-column
        label="图标(转发)"
        width="">
        <template slot-scope="scope">
          <img :src="scope.row.share_icon"  class="icon-img" />
        </template>
      </el-table-column>
      <el-table-column
        label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="简介">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联话题">
        <template slot-scope="scope">
          <router-link class="link-a tetxleft" :to="{path:'/index/TopicDetail?id='+ scope.row.topic_id}">{{scope.row.topic_id}}</router-link>
          <!-- <span>{{ scope.row.topic_id }}</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="参与人数">
        <template slot-scope="scope">
          <span>{{ scope.row.user_count }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="参与次数">
        <template slot-scope="scope">
          <span>{{ scope.row.sign_count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80" >
        <template slot-scope="scope">
          <router-link class="link-a" :to="{path:'/index/plan/edit?id='+ scope.row.id}">修改</router-link>
        </template>
      </el-table-column>
    </el-table>




    <el-pagination v-if="pageShow"
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
</template>

<script>
  import pushService from '../../service/plan';
  import commonService from '../../service/common';

export default {
  name: "pushIndex",
  data() {
    return {
      loading: true,
      pageShow:false,
      content:'',
      value1:'',
      page:1,
      pageNum:10,
      created_at:'',
      title:'',
      itemData:[],
      total:'',
      multipleSelection:[]
    };
  },

  mounted(){
    if (localStorage.getItem("account") == null) {
      this.$router.push({ path: "/" });
      return;
    }
    this.List()

  },
  methods: {
    //弹框
    open(text) {
      this.$alert(text, '信息', {
        confirmButtonText: '确定',
      });
    },
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
    getSourceList:function(){
      this.page = 1;
      this.List()
    },
    addlist:function(){
      this.$router.push('add');
    },
    List:function(){
      const params = {
        page:this.page,
        pageSize:this.pageNum,
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      pushService.List(params).then(data=>{
        if(data.code==0){
          const rdata = data.data
          loadingInstance.close();
          this.page = parseInt(rdata.page);
          this.pageNum = parseInt(rdata.pageSize);
          this.total = parseInt(rdata.total);
          this.itemData =rdata.data ;
            console.log(this.itemData)
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
      this.pageNum = val;
      this.List();
    },
    handleCurrentChange(val){
      this.page = val;
      this.List();
    },
    //新增
  }
};

</script>
<style lang="scss" scoped>
  .inline .el-breadcrumb{float:left;height:32px;line-height: 32px;margin-right:20px;}
.push .el-input__inner {
  height:32px!important;
  line-height:32px!important;
}
.push .el-input__icon{
  height:32px!important;
  line-height:32px!important;
}
</style>
<style scoped>
  .wrap-margin{width:auto!important;}
.line{
    border: 3px solid #409EFF;
}
.disabled{
  pointer-events:none
}
 .detele-btn{
   vertical-align: middle;
   top: 22px;
   right: 30px;
 }
.item-wrap {
  width: 290px;
  height: 258px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  float: left;
  text-align: left!important;
  margin: 20px;
  padding: 2px 23px 0 14px;
}
.title {
  font-size: 16px;
  color: rgba(52, 71, 80, 1);
  line-height: 22px;
}
.tag {
  font-size: 12px;
  color: rgba(179, 179, 179, 0.99);
  line-height: 12px;
}
.text {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
}
.el-checkbox {
    padding-right: 30px;
}
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
.detele-btn {
  display: inline-block;
  float: right;
  top: 0;
  position: relative;
  cursor: pointer;
  width: 50px;
  height: 32px;
  background: -webkit-gradient(linear, left top, right top, from(#fc9474), to(#fb745f));
  background: linear-gradient(90deg, #fc9474, #fb745f);
  border-radius: 4px;
  font-size: 14px;
  color: white;
  line-height: 32px;
  text-align: center;
  margin-right: 1rem;
}
.icon-img{
  width:40px;
  height:40px;
}
</style>
