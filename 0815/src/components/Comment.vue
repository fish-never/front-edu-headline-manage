<template>
  <div>
    <div class="search-wrap">
      <p class="title clearfloat" >评论管理<button class="add-btn" @click="showMore">显示</button></p>
      
    </div>

    <el-table
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      class="wrap-margin"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="60">
      </el-table-column>
      <el-table-column
        label="用户头像" width="200px">
        <template slot-scope="scope">
          <img :src="scope.row.thumb_img" width="25px" class="user-img" />
        </template>
      </el-table-column>
      <el-table-column
        label="用户名称" width="200px">
        <template slot-scope="scope">
          {{scope.row.nickname}}
        </template>
      </el-table-column>
      <el-table-column
        label="描述">
        <template slot-scope="scope">
          <el-popover
          placement="right"
          trigger="click">
          <span>{{ scope.row.content }}</span>
          <span slot="reference">{{ scope.row.content }}</span>
        </el-popover>
         
        </template>
      </el-table-column>
      <el-table-column
        label="评论时间" class="table-th">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="link-status" @click="handleList(scope.row.id,scope.row.type)">显示</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="pageShow"
                   class="page-wrap"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page"
                   :page-sizes="[10,20,30]"
                   :page-size="pageNum"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import commentService from '../service/comment';
  import commonService from '../service/common';
  export default {
    name: 'published',
    data() {
      return {
        pageShow:false,
        loading: true,
        page:1,
        total: 10,
        pageNum: 10,
        data:[],
        param:[],
        ids:"",
        multipleSelection: []
      }
    },
    mounted(){
        if (localStorage.getItem("Token") == null) {
          this.$router.push({ path: "/" });
          return;
        }
      this.loadList();
      commonService.sourceList().then(data=>{
        if(data.code==0){
        this.options = data.data;
        this.pageShow=true;
      }else{
        this.pageShow=false;
      }
    })

    },
    methods: {
          //弹框
     open() {
        this.$alert('操作失败，请稍后重试', '信息', {
          confirmButtonText: '确定',
        });
      },
      // 显示
      handleList(id,type){
        const params ={
          arr: [{"id":id,"type":type}]
        };
        commentService.handleList(params).then(data=>{
          console.log(data)
          if(data.code==0){
            this.loadList();
        }else{
          this.open()
        }
      })
      },
      //批量显示
      showMore(){
         const params ={
          arr: this.param
        };
        commentService.handleList(params).then(data=>{
          console.log(data)
          if(data.code==0){
            this.loadList();
        }else{
           this.open()
        }
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
      handleSelectionChange(val) {
        console.log(val)
         
        val.forEach(item=>{
          item = {
            id: item.id,
            type: item.type
          }
          this.param.push(item)
          
      })
      console.log(this.param)
        this.multipleSelection = val;
      },
      loadList(){
        const params = {
          page:this.page,
          pageSize:this.pageNum,
        };
        commentService.sourceList(params).then(data=>{
          console.log(data)
          if(data.code==0){
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageSize);
          this.total = parseInt(data.data.count);
          this.data = data.data.list;
          console.log(this.data)
          this.loading = false;
        }
      })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user-img{
  border-radius:100%;
}

</style>
