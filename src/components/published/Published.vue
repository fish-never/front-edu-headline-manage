<template>
<div  v-loading="loading">
  <div class="search-wrap">
    <span class="title">检索条件</span>
    <el-select v-model="value" clearable size="small" filterable  placeholder="内容源" style="width:150px;">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-model="value2" clearable size="small" filterable  placeholder="近7天" style="width:150px;">
      <el-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="value3" size="small" clearable filterable  placeholder="所属分类" style="width:150px;">
      <el-option
        v-for="item in types"
        :label="item.typeName" :key="item.id" :value="item.id">
      </el-option>
    </el-select>
    <button class="search-btn" @click="getSourceList">搜索</button>

  </div>

  <el-table
    :data="data"
    tooltip-effect="dark"
    style="width: 100%"
    stripe
    class="wrap-margin">
    <el-table-column
      type="index"
      label="序号"
      width="60">
    </el-table-column>
    <el-table-column
      type="index"
      label="ID"
      width="60">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="所属分类" width="80px">
      <template slot-scope="scope">
        <span>{{ scope.row.type_name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="标题">
      <template slot-scope="scope">
        <span>{{ scope.row.title }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="日期" class="table-th"  width="150px">
      <template slot-scope="scope">
        <span>{{ scope.row.created_at }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="内容源">
      <template slot-scope="scope">
        <span>{{ scope.row.source }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="浏览量" width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.read_count  | money}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="点赞数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.like_count | money}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="评论数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.comment_count  | money }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="转发数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.share_count  | money }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"  width="80px">
      <template slot-scope="scope">
        <span  v-if="scope.row.status==0">
          已发布
        </span>
        <span v-if="scope.row.status==2">
          已下架
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="150px">
      <template slot-scope="scope">
        <router-link  :to="{path:'/index/published/preview/'+scope.row.id}" class="link-a">预览</router-link>
        <router-link  :to="{path:'/index/published/edit/'+scope.row.id}" class="link-a">编辑</router-link>
        <span class="link-status"  v-if="scope.row.status==0"  @click="updataStatusDown(scope.row.id, scope.row.status)">下架</span>
        <span class="link-status"  v-if="scope.row.status==2" @click="updataStatusUp(scope.row.id, scope.row.status)" >发布</span>
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
</style>
