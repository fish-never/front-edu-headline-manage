<template>
  <div>

  <div class="clearfloat wrap-main" v-loading="loading">
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
      <el-select v-model="value2" size="small" clearable placeholder="请选择">
      <el-option
      v-for="item in options2"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
      </el-select>
      <button class="search-btn" @click="getSourceList">搜索</button>
    </div>
      <div class="item-wrap"  v-for="data in itemData" :key="data._id">
          <el-col :span="24" class="item clearfloat">
              <h2 class="title">{{data.title}}]</h2>
              <p class="tag"><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
              <p class="text">{{data.desciption}}</p>
          </el-col>
          <el-row class="opera">
            <el-col :span="12"><router-link  :to="{path:'/index/preview/'+data._id}">预览</router-link></el-col>
            <el-col :span="12" class="border-c"><router-link  :to="{path:'/index/edit/'+data._id}">编辑</router-link></el-col>
          </el-row>
      </div>

  </div>
    
      <el-pagination
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
  import page from "./_common/page";
  import grabService from '../service/grab';
export default {
  name: 'grab',
  components: {page},
  data () {
    return {
      loading: true,
      itemData:[],
      page:1,
      total: 10,
      pageNum: 10,
      options:[],
      value:"",
      value2:"",
      options2: [ {
        value: 1,
        label: '一周'
      }, {
        value: 2,
        label: '一月'
      }, {
        value: 3,
        label: '一年'
      }]

    }
  },
  mounted(){
    this.loadList()

    grabService.sourceList().then(data=>{
      if(data.code==0){
      this.options = data.data;
    }
  })

  },
  methods: {
    getPage(num){
      this.page = num;
      this.loadList()
    },
    getPageNum(num){
      this.pageNum = num;
      this.loadList()
    },
    getSourceList(){
      this.loadList()
    },
    loadList(){
      const params = {
        page:this.page,
        pageNum:this.pageNum,
        source:this.value,
        rangeType:this.value2
      };
      grabService.list(params).then(data=>{
        this.page = parseInt(data.data.page);
        this.pageNum = parseInt(data.data.pageNum);
        this.total = data.data.count;
        this.itemData = data.data.result;
        this.loading = false;
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

    handleEdit(item) {
      console.log(item);
    },
    handlePreview(item) {
      console.log(item);
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../sass/style.scss';
  .wrap-main{
    /*display: table-cell;*/
    /*overflow: scroll;*/
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
    a:hover{
      color:#FD782D;
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
