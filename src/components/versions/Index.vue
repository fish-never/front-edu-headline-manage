<template>
  <div  v-loading="loading">
    <div class="search-wrap">
      <span class="title">版本管理</span>
      <router-link class="newadd-btn" to="/index/versionsAdd">新增</router-link>
    </div>

    <el-table
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      class="wrap-margin"
      stripe>
      <el-table-column
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        label="版本号">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否处于审核">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">否</span>
          <span v-if="scope.row.status == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"  width="180px">
        <template slot-scope="scope">
          <router-link class="link-a" :to="{path:'/index/VersionsEdit/'+ scope.row.id}">编辑</router-link>
          <span class="link-a" type="button" @click="handleDelete(scope.row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
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
  import versionsService from '../../service/version';
  export default {
    name: 'published',
    data() {
      return {
        loading: true,
        ids:"",
        page:1,
        total: 10,
        pageSize: 10,
        data:[],

      }
    },
    mounted(){
      this.loadList();
    },
    methods: {
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
// 删除
      handleDelete(id) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const params = {
              ids: id
            }
            console.log(params)
            versionsService.delete(params).then(data=>{
              console.log(data)
              if(data.code==0){
                this.loadList()
            }else{
              this.open(data.msg)
            }
          })
        })

      },
      loadList(){
        const params = {
          page:this.page,
          pageSize:this.pageSize,
        };
        versionsService.getLists(params).then(data=>{
          if(data.code==0){
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageSize);
          this.total = parseInt(data.data.count);
          this.data = data.data.list;
          this.loading = false;
        }else{
          this.open(data.msg)
        }
      })
      },
      getSourceList(){
        this.page = 1;
        this.loadList()
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.loadList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.loadList();
      }

    }
  }
</script>


<style scoped lang="scss">


</style>
