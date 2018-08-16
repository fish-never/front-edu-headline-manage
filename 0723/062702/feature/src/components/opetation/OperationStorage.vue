<template>
  <div  v-loading="loading">
    <div class="search-wrap">
      <span class="title">检索条件</span>
      <el-select v-model="value1" clearable size="small" filterable  placeholder="内容源" style="width:150px;">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="value2" clearable size="small" filterable placeholder="近7天" style="width:150px;">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value3" size="small" clearable filterable placeholder="所属分类" style="width:150px;">
        <el-option
          v-for="item in types"
          :label="item.typeName" :key="item.id" :value="item.id">
        </el-option>
      </el-select>
      <button class="search-btn" @click="getSourceList">搜索</button>
      <router-link class="newadd-btn" to="/index/add">新建文章</router-link>
      <button class="detele-btn" @click="deleteLists" title="删除">删除</button>
    </div>

    <el-table
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
      class="wrap-margin"
      stripe
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

      <el-table-column label="操作"  width="180px">
        <template slot-scope="scope">
          <router-link   :to="{path:'/index/operationPreview/'+scope.row.id}" class="link-a">预览</router-link>
          <router-link  :to="{path:'/index/operationEdit/'+scope.row.id}" class="link-a">编辑</router-link>
          <span class="link-a"
            type="button"
            @click="handleDelete(scope.row.id, scope.row)">删除</span>
           <span v-if="scope.row.status==0" class="link-status" @click="publishData(scope.row.id, scope.row)">发布</span>
           <span v-if="scope.row.status==1"  type="text" class="link-b"  disabled>已发布</span>
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
  import operationService from '../../service/operation';
  import commonService from '../../service/common';
  export default {
    name: 'published',
    data() {
      return {
        pageShow:false,
        loading: true,
        multipleSelection:[],
        ids:"",
        page:1,
        total: 10,
        pageNum: 10,
        types:"",
        data:[],
        value1:"",
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
      operationService.sourceData().then(data=>{
        if(data.code==0){
          this.options= data.data;
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
          //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      goPreview(id,display_type){
        if(display_type==4){
          this.$router.push({
            path: '/index/previewVideoPreview/',
            query: {
              id: id,
              display_type:display_type
            }
          })
        }else{
          this.$router.push({
            path: '/index/operationPreview/',
            query: {
              id: id,
              display_type:display_type
            }
          })
        }

      },

      publishData(index, row){
         this.$confirm('是否发布信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        }).then(() => {
        const params = {
          id:row.id
        };
        operationService.publishData(params).then(data=>{
          console.log(data.data.code)
          if(data.data.code==0){
            this.loadList()
        }else{
          this.open("发布信息失败")
        }
      })
        })

      },
      deleteLists(){
        if(this.ids.length>0){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const params = {
              ids:this.ids
            };
            operationService.deleteData(params).then(data=>{
              console.log(data)
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.ids='';
        val.forEach(item=>{
               this.ids = item.id + "," + this.ids;
          })
          this.ids = this.ids.replace(/,$/,'')
           },
      handleDelete(index, row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(index, row.id);
            const params = {
              ids:row.id
            };
            operationService.deleteData(params).then(data=>{
              console.log(data)
              if(data.code==0){
                this.loadList()
            }
          })
        }).catch(() => {       
        });

      },
      loadList(){
        const params = {
          typeId:this.value3,
          page:this.page,
           source:this.value1,
          pageNum:this.pageNum,
          rangeType:this.value2
        };
        console.log(params)
         const loadingInstance = this.$loading({ fullscreen: true });
        operationService.sourceList(params).then(data=>{
          if(data.code==0){
            loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
          this.data = data.data.result;
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
        this.pageNum = val;
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
