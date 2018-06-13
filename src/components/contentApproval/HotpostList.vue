<template>
  <div>
    <div class="clearfloat wrap-main">
      <div class="search-wrap">
         <span class="mgr20"><router-link to="/index/HotpostList">社区管理</router-link>>热帖列表</span>
        <!-- <span class="title">检索条件</span> -->
        <el-input v-model="content" placeholder="话题关键字" clearable class="searchinput mgr20"></el-input>
       <el-input v-model="username" placeholder="用户名" clearable  class="searchinput"></el-input>
        <button class="search-btn" @click="getSourceList">搜索</button>
      </div>
    </div>
    <el-table
      :data="itemData"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      class="wrap-margin">
      <el-table-column   label="用户"  width="200">
        <template slot-scope="scope">
          <span class="lh30 username"><img :src="touxiang" alt="" class="userimg"></span>
          <span class="lh30 nametext">00000000</span>
        </template>
      </el-table-column>
      <el-table-column
        label="内容">
        <template slot-scope="scope">
          <router-link class="link-a texthandle" :to="{path:'/index/contentApproval/HotpostListEdit/'+ scope.row.id}">{{scope.row.content.content}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="评论时间">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column
      label="评论数"  width="60px">
      <template slot-scope="scope">
        <span>{{scope.row.comment_count}}</span>
      </template>
    </el-table-column>
         <el-table-column
      label="浏览量" width="60px">
      <template slot-scope="scope">
         <input v-model="scope.row.read_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column
      label="点赞数"  width="60px">
      <template slot-scope="scope">
         <input v-model="scope.row.like_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    
    <el-table-column
      label="转发数"  width="60px">
      <template slot-scope="scope">
         <input v-model="scope.row.share_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column
      label="权重值"  width="60px">
      <template slot-scope="scope">
         <input v-model="scope.row.weight" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
      <el-table-column label="操作"  width="150px">
        <template slot-scope="scope">
            <span class="link-a" type="button" @click="hotStatusHide(scope.row)">下热门</span>
          <span class="link-a" type="button" @click="Detele(scope.row.id)">删除</span>
        </template>
      </el-table-column>
      <el-table-column label=""  width="150px">
        <template slot-scope="scope">
            <span class="link-a" type="button" @click="Detele(scope.row.id)"><img src="../../assets/imgs/drag.svg" alt="" /></span>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script>
import postList from "../../service/postList"; //控制器
export default {
  name: "grab",
  data() {
    return {
      pageShow: false,
      itemData: [],
      page: 1,
      ids: "",
      total: 10,
      pageNum: 10,
      content:"",
      username:"",
      touxiang:require("../../assets/imgs/userimg1.png")
    };
  },
  mounted() {
    if (localStorage.getItem("Token") == null) {
      this.$router.push({ path: "/" });
      return;
    }
    this.loadList();
  },
  filters: {
    money: function(val) {
      let pattern = /(?=((?!\b)\d{3})+$)/g;
      return val.replace(pattern, ",");
    }
  },
  methods: {
    //弹框
    open(text) {
      this.$alert(text, "信息", {
        confirmButtonText: "确定"
      });
    },
    getPage(num) {
      this.page = num;
      this.loadList();
    },
    getPageNum(num) {
      this.pageNum = num;
      this.loadList();
    },
    getSourceList() {
      this.page = 1; // 防止翻页后搜索功能失效
      this.loadList();
    },
    loadList() {
     const loadingInstance = this.$loading({ fullscreen: true });
      postList.pagination({
         page: this.page,
        pageNum: this.pageNum,
        content: this.content,
        user_name: this.username
      }).then(data => {
        if (data.code == 0) {
         loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
          const temp = [];
          data.data.result.forEach(item =>{
            if(item.is_hot == "1"){
              temp.push(item);
             // temp.id= item.id; //本身有id，不会重排
            }
          });
           this.itemData = temp;
          this.pageShow = true;
        } else {
          this.pageShow = false;
        }
      });
    },
    Detele(ids) {
      const params = {
        ids: ids
      };
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          postList.detele(params).then(data => {
            if (data.code == 0) {
              this.loadList();
            } else {
              this.open(data.msg);
            }
          });
        })
    },
   
    handleSizeChange(val) {
      this.pageNum = val; // 改变每页显示条数
      this.loadList(); // 重新请求
    },
    handleCurrentChange(val) {
      this.page = val; // 改变页码
      this.loadList(); // 重新请求
    },
    queryAsync(){
      // console.log("...");
    },
    updateData(rowdata){
      if(rowdata.read_count == "" || rowdata.like_count == ""|| rowdata.like_count =="" || rowdata.share_count =="" || rowdata.weight =="" || rowdata.read_count == null || rowdata.like_count == null|| rowdata.like_count == null || rowdata.share_count == null || rowdata.weight == null){
               this.open("必填项不能为空");
               return false;
           }
    if(isNaN(rowdata.read_count) || isNaN(rowdata.like_count) || isNaN(rowdata.like_count) || isNaN(rowdata.share_count) || isNaN(rowdata.weight)){
        this.open("修改项必须为数字");
        return false;
    }
      postList.update({
          id:rowdata.id,
          comment_count:parseInt(rowdata.comment_count),
          read_count:parseInt(rowdata.read_count),
          like_count:parseInt(rowdata.like_count),
          share_count:parseInt(rowdata.share_count),
          is_hot:rowdata.is_hot,
          weight:parseInt(rowdata.weight)
          }).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
    },
      hotStatusHide(rowdata){
          if(rowdata.read_count == "" || rowdata.like_count == ""|| rowdata.like_count =="" || rowdata.share_count =="" || rowdata.weight =="" || rowdata.read_count == null || rowdata.like_count == null|| rowdata.like_count == null || rowdata.share_count == null || rowdata.weight == null){
               this.open("必填项不能为空");
               return false;
           }
    if(isNaN(rowdata.read_count) || isNaN(rowdata.like_count) || isNaN(rowdata.like_count) || isNaN(rowdata.share_count) || isNaN(rowdata.weight)){
        this.open("修改项必须为数字");
        return false;
    }
        this.$confirm('确定下热门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        postList.update({
          id:rowdata.id,
          comment_count:parseInt(rowdata.comment_count),
          read_count:parseInt(rowdata.read_count),
          like_count:parseInt(rowdata.like_count),
          share_count:parseInt(rowdata.share_count),
          is_hot:"0",
          weight:parseInt(rowdata.weight)
         }).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
        }).catch(data => { 
          this.open(data);      
        });

      }
  }
};
</script>

<style scoped lang="scss">
.lh30{line-height: 30px;}
.texthandle{display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;cursor: pointer;}
.searchinput{display:inline-block;width:150px;background-color: #fff; background-image: none;    border-radius: 4px;}
.username{display:inline-block;}
.userimg{width:30px;height:30px;display:block;border-radius:50%;margin-right:20px;line-height: 40px;}
.nametext{display:block;margin-top:-35px;padding-left:40px;}
.numinput{display:inline-block;width:40px;border:0;border-radius: 4px;text-align: center;height:30px;line-height: 30px;}
.numinput:focus{border:1px solid #dcdfe6;background-color: none;}
.item-wrap {
  width: 290px;
  height: 258px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  float: left;
  text-align: left;
  margin: 20px;
  position: relative;

  .item {
    padding: 16px 19px 19px 19px;
  }
  .opera {
    text-align: center;
    color: #96abb5;
    font-size: 14px;
    height: 40px;

    border-top: 1px solid #edf1f2;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      color: #666;
      &:hover {
        color: #fd782d;
      }
    }
    a {
      display: block;
      &:hover {
        color: #fd782d;
      }
    }
    .el-col {
      height: 39px;
      line-height: 39px;
    }

    .border-c {
      border-left: 1px solid #edf1f2;
      border-right: 1px solid #edf1f2;
    }
  }
}
.mgr20{margin-right:20px;display: inline-block}
.title {
  font-size: 16px;
  color: rgba(52, 71, 80, 1);
  line-height: 22px;
  font-weight: 600;
}
.tag {
  font-size: 12px;
  color: rgba(179, 179, 179, 0.99);
  line-height: 12px;
  margin-top: 5px;
}
.text {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
  margin: 14px 0 21px 0;
}
</style>
