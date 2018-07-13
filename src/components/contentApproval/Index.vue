<template>
  <div  v-loading="loading">
    <div class="location">
      <span class="grey">社区管理</span>>内容审核
      <div class="show-pages">
          <span>显示文章（篇）</span>
          <el-select v-model="value" clearable size="small" filterable placeholder="20" style="width:80px;" @change="search(value)">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
    </div>
    <div class="item-wrap" v-for="item in data.my_jobs" :key="item.post_master_id" @click="checked(item)"  :class="{selected: item.selected}">
     <div class="item">
        <h2 class="title-p" style="font-size:24px; color:#333;line-height:25px;">{{item.post_subject}}</h2>
        <p class="tag">
          <span>{{item.create_time}}</span>
        </p>
        <div class="text" v-html="item.content"></div>
        <button class="pass" @click="Pass(item.post_master_id)">通过</button>
        <button class="delete" @click="Detele(item.post_master_id)">删除</button>
      </div>
      <img class="checked" :src="selectedUrl" v-if="item.selected"/>
    </div>
    <button class="opera-btn" @click="deleteLists">删除已选中，通过未勾选</button>
    <div style="margin-top:100px">
    <el-pagination
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
  </div>
</template>

<script>
import contentApprovalService from '../../service/contentApproval';
export default {
  name: 'preview',
  data () {
    return {
      loading: false,
      selected:false,
      data:{},
      id:"5b1db30a62f531394f026242",
      pageShow:false,
      page:1,
      ids:"",
      types:"",
      total: 10,
      pageNum: 10,
      options:[20,50,100,200,500,1000,2000,3000],
      value:"",
      selectedUrl:require("../../assets/imgs/selested.svg")

    }
  },
  created(){

  },
  mounted(){
     if (localStorage.getItem("Token") == null) {
      this.$router.push({ path: "/" });
      return;
    }
    this.loadList()

  },

watch:{

},
 methods: {
   //上面分页
   search(value){
     console.log(value)
     this.pageNum = value;
     this.loadList()
   },
      //获取内容列表
  checked(item){
      if(item.selected){
        item.selected = false
      }else{
        item.selected = true;
      }
      },
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
      getPage(num){
        this.page = num;
        this.loadList()
      },
      getPageSize(num){
        this.pageNum = num;
        this.loadList()
      },

      //获取内容列表
      loadList(){
        let params = {
          pageNum:this.pageNum,
          page:this.page,
        };
        contentApprovalService.getList(params).then(data=>{
          if(data.code==0){
          console.log(data.data);
          this.loading = false;
          this.total = data.data.total;
          this.pageNum = data.data.pageNum;
          this.page = data.data.page;
          data.data.my_jobs.forEach(item =>{
            item.selected = false;
          });
          this.data = data.data;
        }
        })
      },
      //单个通过
      Pass(post_master_id){
        console.log(post_master_id)
       const params = {
            ids_delete: "",
            ids_pass:post_master_id
        }
        console.log(params)
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((data) => {
            contentApprovalService.check(params).then(data=>{
              if(data.code==0){
                this.$message({
                  type: 'success',
                  message: '通过成功!'
                });
                this.loadList()
              }else{
                this.open(data.msg)
              }

          })
        }
        )

      },
      //单个删除
     Detele(ids){
       console.log(ids)
       const params = {
            ids_delete: ids,
            ids_pass:""
        }
       console.log(params)
       this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          contentApprovalService.check(params).then(data=>{
            if(data.code==0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            this.loadList()
            }else{
            this.open(data.msg)
            }

          })
        }
        )

      },
      //删除已选中，通过未勾选
      deleteLists(){
       let ids_delete = "";
       let ids_pass ="";
       this.data.my_jobs.forEach(item => {
         if( item.selected){
           ids_delete += item.post_master_id +","
         }else{
           ids_pass += item.post_master_id +","
         }

       });
       ids_delete =  ids_delete.replace(/,$/,'');
       ids_pass =  ids_pass.replace(/,$/,'');
        const params = {
            ids_delete: ids_delete,
            ids_pass:ids_pass
        }
        this.$confirm('确定删除已选中，通过未勾选?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          contentApprovalService.check(params).then(data=>{
            if(data.code==0){
              this.loadList()
            }else{
              this.open(data.msg)
            }

          })
        })

      },
      handleSizeChange(val){
        this.pageNum = val;
        this.loadList();
      },
      handleCurrentChange(val){
        this.page = val;
        console.log(val);
        this.loadList();
      }
    }
  }
</script>

<style scoped lang="scss">
.opera-btn{
  width:200px;
  height:40px;
  display: block;
  float:right;
  color:#fff;
  margin:15px 20px 0 30px;
  background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
  border-radius:20px;
  clear: both;
  cursor: pointer;

}
.selected{
  border:6px solid #FD782D;
}
.checked{
    position: absolute;
    width: 120px;
    height:100px;
    right: -20px;
    bottom: -20px;
}

.item-wrap{
  position: relative;
  cursor: pointer;
  margin: 10px 0px 10px 30px;
  overflow: hidden;
}

.item{
  background:rgba(255,255,255,1);
  padding:30px 100px 40px 25px;
  overflow-y: auto;
  }
.pass,.delete{
  height:38px;
  width:76px;
  display: inline-block;
  position: absolute;
  color: #fff;
  right:0;
  cursor: pointer;
}
.pass{
  background: #FD782D;
  top:43px;
}
.delete{
  background: #344750;
  top:100px;
}
.show-pages{
  float:right;

}
  .link-a:visited{
  color:red;
}
a:visited{
  color:red;
}
.red{
  color:red;
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
    margin:16px 0;
    span{
      padding-right:20px;
    }
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
    margin:0px 0 21px 0;
  }

</style>
