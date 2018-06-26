<template>
  <div class="push" v-loading="loading" id="pushIndex">

    <div class="search-wrap">
      <span class="mgr20"><router-link to="/index/publishingPool">推送管理</router-link>>运营推送管理</span>

      <el-input v-model="content" size="small" placeholder="请输入文章标题" clearable class="searchinput mgr20" style="width:150px;"></el-input>
      <div class="block" size="small" style="width:220px;display:inline-block;height:32px;line-height: 32px;">
        <el-date-picker v-model="value1" type="date" placeholder="选择日期">
        </el-date-picker>
      </div>
      <button class="search-btn" @click="getSourceList">搜索</button>
      <button class="detele-btn" @click="addlist" title="删除">新增</button>
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
        label="文章标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间" class="table-th">
        <template slot-scope="scope">
          <span>{{ scope.row.publish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间">
        <template slot-scope="scope">
          <span>{{ scope.row.send_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="抄送人数">
        <template slot-scope="scope">
          <span>{{ scope.row.send_num }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推送方式">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <router-link v-if="scope.row.send_num==0" class="link-a" :to="{path:'/index/push/edit?id='+ scope.row.id}">编辑</router-link>

          <span class="link-a"
                type="button"
                @click="Delete(scope.row.id)">删除</span>
          <span v-if="scope.row.send_num==0" class="link-a"
                type="button"
                @click="SendNow(scope.row.id)">立即发送</span>
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
  import pushService from '../../service/push';
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
    this.verbList()

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
      this.verbList()
    },
    addlist:function(){
      this.$router.push('add');
    },
    SendNow:function(tid){
      const vm =this
      const params = {
        id:parseInt(tid),
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      pushService.sendNow(params).then(data=>{
        if(data.code==0 && data.data.result){
          vm.open("推送成功！")
          loadingInstance.close();
          vm.verbList()
        }else{
          vm.open("推送失败，请重试！")
          this.pageShow=false;
          this.loading = false;
        }

      })
    },
    Delete:function(tid){
      const params = {
        id:parseInt(tid),
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      pushService.deletePush(params).then(data=>{
        if(data.code==0 && data.data.result){
          this.open("删除成功！")
          loadingInstance.close();
          this.verbList()
        }else{
          this.open("删除失败，请重试！")
          this.pageShow=false;
          this.loading = false;
        }

      })
    },
    verbList:function(){
      if(this.value1&&this.value1!=''){
        this.value1=this.value1.format('yyyy-MM-dd h:m:s')
      }

      const params = {
        title:this.content,
        created_at:this.value1,
        page:this.page,
        pageNum:this.pageNum,
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      pushService.verbList(params).then(data=>{
        if(data.code==0){
          loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
          this.itemData = data.data.result;
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
      this.pageNum = val;
      this.verbList();
    },
    handleCurrentChange(val){
      this.page = val;
      this.verbList();
    },
    //新增
  }
};

  Date.prototype.format = function(format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
</script>
<style>

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
</style>
