<template>
  <div class="pooldiv">
    <div class="search-wrap inline margin-b20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index/contentApproval/HotpostList' }">社区管理</el-breadcrumb-item>
        <el-breadcrumb-item>发布池内容管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="overflow-h margin-t10">
        <div class="float-l">
          <el-input v-model="content" size="small" placeholder="请输入话题关键字" clearable class="searchinput mgr20" style="width:150px;"></el-input>
          <el-input v-model="username" size="small" placeholder="请输入用户名" clearable class="searchinput mgr20" style="width:150px;"></el-input>

          <button class="search-btn" @click="getSourceList">搜索</button>
        </div>

      </div>
    </div>
    <el-table  :data="itemData"  tooltip-effect="dark" stripe  style="width: 100%" class="pooltab">
      <el-table-column  label="用户"  width="130">
        <template slot-scope="scope">
          <div>
            <div class="float-l img-div"><img :src="scope.row.thumb_img" alt="" /></div>
            <div class="float-l nick-div">{{scope.row.nickname}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="内容" class="content-width" width="200">
        <template slot-scope="scope">
          <router-link class="link-a tetxleft texthandle" :to="{path:'/index/contentApproval/PublishingPoolEdit/'+ scope.row.id}">{{scope.row.content.content}}</router-link>
        </template>
      </el-table-column>
      <el-table-column  label="评论时间" prop="created_at" width="140">

      </el-table-column>
      <el-table-column  label="评论数" prop="comment_count">

      </el-table-column>
      <el-table-column  label="浏览量">
        <template slot-scope="scope">
          <input v-model="scope.row.read_count" class="numinput" @change="updateData(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column  label="点赞数">
        <template slot-scope="scope">
          <input v-model="scope.row.like_count" class="numinput" @change="updateData(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column label="转发数">
        <template slot-scope="scope">
          <input v-model="scope.row.share_count" class="numinput" @change="updateData(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="热门" width="80">
        <template slot-scope="scope">
          <el-tooltip :content="'当前热门状态：'+toast(scope.row.is_hot)" placement="top">
            <el-switch
              v-model="scope.row.is_hot"
              active-color="#FD782D"
              inactive-color="#96ABB5"
              active-value="1"
              inactive-value="0"
              @change="updateData(scope.row)">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="80" >
        <template slot-scope="scope">
          <span type="button" class="link-a"  @click="Detele(scope.row.id)">删除</span>
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
   computed: {

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
    toast:function(val){
            return val == "0"?"未开启":"开启";
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
      this.page = 1;
      this.loadList();
    },
    loadList() {
     const loadingInstance = this.$loading({ fullscreen: true });
      postList.pagination({
         page: this.page,
        pageNum: this.pageNum,
        content: this.content,
        user_name: this.username,
        topic_id:0
      }).then(data => {
        if (data.code == 0) {
         loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
         this.itemData = data.data.result;
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
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadList();
          } else {
            this.open(data.msg);
          }
        });
      })
        .catch(data => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
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
      if(rowdata.read_count === ""||rowdata.like_count === ""||rowdata.share_count === ""||rowdata.weight === "" || rowdata.read_count == null||rowdata.like_count == null||rowdata.share_count == null||rowdata.weight == null){
        this.open("修改项不能为空");
        this.loadList();
        return false;
      }else{
        if(isNaN(rowdata.read_count)||isNaN(rowdata.like_count)||isNaN(rowdata.share_count)||isNaN(rowdata.weight)){
          this.open("修改项必须为数字");
          this.loadList();
          return false;
        }else{
          if(parseInt(rowdata.read_count)<0||parseInt(rowdata.read_count)>99999||parseInt(rowdata.like_count)<0||parseInt(rowdata.like_count)>99999||parseInt(rowdata.share_count)<0||parseInt(rowdata.share_count)>99999||parseInt(rowdata.weight)<0||parseInt(rowdata.weight)>99999){
            this.open("修改项必须大于0或小于99999");
            this.loadList();
            return false;
          }else{
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
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.loadList();
            } else {
              this.open(data.msg);
              this.loadList();
            }
          });
          }
        }
      }

    }
  }
};
</script>
<style>
  .el-table thead th {
    background-color: #96ABB5
  }
</style>
<style scoped lang="scss">
  .pooldiv .pooltab .cell{color:#000;}
  .pooltab td{color:#000;}
  .margin-b20{margin-bottom: 20px;}
  .content-width{width:200px;}
  .float-l{float:left;}
  .user-div{width:100px;}
div.nick-div{color:#000;height:25px;line-height:25px;width:60px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:4px;}
  .img-div{width:25px;height:25px;}
  .img-div img{width:100%;border-radius:50%;}

  .tetxleft{text-align: left;}
.lh30{line-height: 30px;}
.texthandle{height:25px;position: relative;line-height: 25px;overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  -webkit-text-overflow:ellipsis;
  -moz-text-overflow:ellipsis;
  white-space:nowrap;}
.searchinput{display:inline-block;width:150px;background-color: #fff; background-image: none;    border-radius: 4px;}
.username{display:inline-block;}
.userimg{width:30px;height:30px;display:block;border-radius:50%;margin-right:20px;line-height: 40px;float: left;}
.nametext{display:block;margin-top:-35px;padding-left:40px;}

.mainTab{margin:20px 0 0 20px;}
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
  .el-breadcrumb{float:left;height: 32px;
    line-height: 32px;
    margin-right: 20px;}
  .overflow-h{overflow: hidden;}
</style>
