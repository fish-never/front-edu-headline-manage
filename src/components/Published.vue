<template>
<div>
  <div class="search-wrap">
    <span class="title">检索条件</span>
    <el-select v-model="value" clearable size="small" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <!--<el-select v-model="value" clearable placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in options"-->
    <!--:key="item"-->
    <!--:label="item"-->
    <!--:value="item">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <button class="search-btn">搜索</button>

  </div>

  <el-table
    :data="data"
    tooltip-effect="dark"
    style="width: 100%"
    class="wrap-margin"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="index"
      label="序号"
      width="60">
    </el-table-column>
    <el-table-column
      label="所属分类" width="80px">
      <template slot-scope="scope">
        <span>{{ scope.row.tag }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="标题">
      <template slot-scope="scope">
        <span>{{ scope.row.title }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="日期" class="table-th">
      <template slot-scope="scope">
        <span>{{ scope.row.created_at }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="内容源" width="90px">
      <template slot-scope="scope">
        <span>{{ scope.row.source }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="浏览量" width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.come_from }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="点赞数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.like_count }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="评论数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.comment_count }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="转发数"  width="60px">
      <template slot-scope="scope">
        <span>{{ scope.row.share_count }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"  width="80px">
      <template slot-scope="scope">
        <span  v-if="scope.row.status==0">
          已发布
        </span>
        <span v-if="scope.row.status==1">
          已下架
        </span>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <router-link  :to="{path:'/index/published/preview/'+scope.row.id}">预览</router-link>
        <router-link  :to="{path:'/index/published/edit/'+scope.row.id}">编辑</router-link>
        <span>下架</span>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  import publishedService from '../service/published';
  import grabService from '../service/grab';
  export default {
    name: 'published',
    data() {
      return {
        data:[],
        value:"",
        options:[]
      }
    },
    mounted(){
      var params ={}
      publishedService.sourceList(params).then(data=>{
        if(data.code==0){
        this.data = data.data.result;
        console.log(this.data)
      }
    }),
      grabService.sourceList().then(data=>{
        if(data.code==0){
        this.options = data.data;
      }
    })
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../sass/style.scss';

</style>
