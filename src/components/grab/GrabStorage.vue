<template>
  <div  v-loading="loading">

    <div class="clearfloat wrap-main">
      <div class="search-wrap">
        <span class="title">检索条件</span>
        <el-select v-model="value" clearable size="small" placeholder="内容源" style="width:150px;">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="value2" size="small" clearable placeholder="请选择" style="width:150px;">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="value3" size="small" clearable placeholder="所属分类" style="width:150px;">
        <el-option
          v-for="item in types"
          :label="item.typeName" :key="item.id" :value="item.id">
        </el-option>
      </el-select>
        <button class="search-btn" @click="getSourceList">搜索</button>
         <button class="detele-btn" @click="deleteLists" title="删除"></button>

      </div>
      <!-- <div class="item-wrap"  v-for="data in itemData" :key="data._id">
        <el-col :span="24" class="item clearfloat">
          <h2 class="title">{{data.title}}</h2>
          <p class="tag"><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
          <p class="text">{{data.desciption}}</p>
        </el-col>
        <el-row class="opera">
          <el-col :span="8"><router-link  :to="{path:'/index/preview/'+data._id}">预览</router-link></el-col>
          <el-col :span="8" class="border-c"><router-link  :to="{path:'/index/edit/'+data._id}">编辑</router-link></el-col>
          <el-col :span="8" class="border-c"><button  @click="detele(data._id)">删除</button></el-col>
        </el-row>
      </div> -->

    </div>
    <el-table
      :data="itemData"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      class="wrap-margin"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
        </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        label="分类" width="120px">
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
        label="日期" class="table-th">
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
        label="状态">
        <template slot-scope="scope"  width="100px">
          <span v-if="scope.row.status==1">已发布</span>
          <span v-if="scope.row.status==0">未发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="150px">
        <template slot-scope="scope">
          <router-link class="link-a" :to="{path:'/index/preview/'+ scope.row._id}">预览</router-link>
          <!-- <p @click="mark(scope.row.status)" >
            {{scope.row.status}} -->
          <router-link class="link-a" :to="{path:'/index/edit/'+ scope.row._id}">编辑</router-link>
          <!-- </p> -->
          <span class="link-a"
            type="button"
            @click="Detele(scope.row._id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-wrap"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,20,30,50,100,200]"
      :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import grabService from '../../service/grab';
  import commonService from '../../service/common';
  export default {
    name: 'grab',
    data () {
      return {
        pageShow:false,
        loading: true,
        itemData:[],
        page:1,
        ids:"",
        types:"",
        total: 10,
        pageNum: 10,
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
          label: '近7天'
        }, {
          value: 3,
          label: '近1一个月'
        }, {
          value: 4,
          label: '近1年'
        }]

      }
    },
    mounted(){
      this.loadList()
      commonService.typeList().then(data => {
        if(data.code == 0){

        this.types = data.data;
        console.log(this.types)
      }
    }),
      grabService.sourceList().then(data=>{
        if(data.code==0){
        this.options = data.data;
      }
    })
    },
    methods: {
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      //点击编辑
      // markEdited
      mark(mark){
        mark =2;
      // console.log(mark)
        // return mark;
      
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
          rangeType:this.value2,
          typeId:this.value3,
        };
       const loadingInstance = this.$loading({ fullscreen: true });
        grabService.list(params).then(data=>{
          if(data.code==0){
              loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = data.data.count;
          this.itemData = data.data.result;
       //   console.log(this.itemData)
          this.loading = false;
          this.pageShow=true;
        }else{
          this.pageShow=false;
        }

      })
      },
     Detele(ids){
       const params = {
            ids: ids
        }
      // console.log(ids)
         this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          grabService.detele(params).then(data=>{
            if(data.code==0){
            this.loadList()
            }else{
            this.open(data.msg)
            }

          })
        }
        )

      },
      //删除
      deleteLists(){
        console.log(this.ids)
        if(this.ids.length>0){
           const params = {
              ids:this.ids
           };
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          grabService.detele(params).then(data=>{
            if(data.code==0){
            this.loadList()
            }else{
            this.open(data.msg)
            }

          })
        }).catch(() => {       
        });
        }else{
           this.open("请先对需要删除的数据进行勾选")
        }


    
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
      //  console.log(item);
      },
      handlePreview(item) {
      //  console.log(item);
      }
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
