<template>
  <div>
      <div class="search-wrap inline">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index/contentApproval/HotpostList' }">社区管理</el-breadcrumb-item>
          <el-breadcrumb-item>热帖列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="overflow-h margin-t10">
          <div class="float-l">
            <el-input v-model="content" size="small" placeholder="请输入话题关键字" clearable class="searchinput mgr20" style="width:150px;"></el-input>
            <el-input v-model="username" size="small" placeholder="请输入用户名" clearable class="searchinput mgr20" style="width:150px;"></el-input>

            <button class="search-btn" @click="getSourceList">搜索</button>
          </div>

        </div>
      </div>

      <table class="tabwarp">
        <tr>
          <th class="user-div">用户</th>
          <th class="comment_count">内容</th>
          <th>评论时间</th>
          <th>评论数</th>
          <th>浏览量</th>
          <th>点赞数</th>
          <th>转发数</th>
          <th>权重值</th>
          <th>操作</th>
          <th style="width:80px;"></th>
        </tr>
        <draggable v-model="itemData" :move="getdata" @update="datadragEnd" element="tbody"><!--draggable会自动生成一个外层div标签导致与上面的tr不平齐，这里使用element="tbody"将其改变成tbody，也不会影响渲染的tr-->
          <tr v-for="item in itemData" :key="item.key">
            <td>
              <div>
                <div class="float-l img-div"><img :src="item.thumb_img" alt="" /></div>
                <div class="float-l nick-div">{{item.nickname}}</div>
              </div>
            </td>
          <td><router-link class="link-a tetxleft" :to="{path:'/index/contentApproval/HotpostListEdit/'+ item.id}">{{item.content.content}}</router-link></td>
          <td><div>{{item.created_at}}</div></td>
          <td><div>{{item.comment_count}}</div></td>
          <td><div><input type="text" v-model="item.read_count" @blur="updateData(item)" /></div></td>
          <td><div><input type="text" v-model="item.like_count"  @blur="updateData(item)" /></div></td>
          <td><div><input type="text" v-model="item.share_count"  @blur="updateData(item)" /></div></td>
          <td><div><input type="text" v-model="item.weight"  @blur="updateData(item)" /></div></td>
          <td>
            <div>
              <span type="button" class="link-a" @click="hotStatusHide(item)">下热门</span>
              <span  type="button" class="link-a" @click="Detele(item.id)">删除</span>
          </div>
          </td>
          <td><div><img src="../../assets/imgs/drag.svg" alt="" /></div></td>
          </tr>
        </draggable>
      </table>

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
import draggable from 'vuedraggable';
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
  components: {
      draggable
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
    rnd(n,m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random>=0?random:-random; //去掉负数
    },
    getdata: function(evt){
      console.log(evt.draggedContext.element.id);
    },
    datadragEnd:function(evt){
      console.log('拖动前的索引：'+evt.oldIndex);
      console.log('拖动后的索引：'+evt.newIndex);
      if(evt.oldIndex>evt.newIndex){
        var theRow=this.itemData[evt.newIndex]
        var theBeforeRow=this.itemData[evt.newIndex+1]
        this.itemData[evt.newIndex].weight=parseInt(this.itemData[evt.newIndex+1].weight)+1
      }else{
        var theRow=this.itemData[evt.newIndex]
        var theBeforeRow=this.itemData[evt.newIndex-1]
        if(parseInt(this.itemData[evt.newIndex-1].weight)<=0){
          this.itemData[evt.newIndex].weight=0
        }else{
          this.itemData[evt.newIndex].weight=parseInt(this.itemData[evt.newIndex-1].weight)-1
        }

      }
      this.updateData(this.itemData[evt.newIndex])
    },

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
        user_name: this.username,
        is_hot:1,
        topic_id:0
      }).then(data => {
        if (data.code == 0) {
         loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
         // const temp = [];
          // data.data.result.forEach(item =>{ // 前端过滤会导致分页参数有误
          //   if(item.is_hot == "1"){
          //     temp.push(item);
          //    // temp.id= item.id; //本身有id，不会重排
          //   }
          // });
         // this.itemData  = temp;
           this.itemData = data.data.result;
           this.itemData = this.itemData.sort((a,b)=>{ // 倒序
                return b.weight - a.weight;
            });
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

    },
    updateData(rowdata){
      if(rowdata.read_count === ""||rowdata.like_count === ""||rowdata.share_count === ""||rowdata.weight === "" || rowdata.read_count == null||rowdata.like_count == null||rowdata.share_count == null||rowdata.weight == null){
        this.open("修改项不能为空");
        this.loadList();
        return false;
      }else{
        if(isNaN(rowdata.read_count)||isNaN(rowdata.like_count)||isNaN(rowdata.share_count)||isNaN(rowdata.weight)){
          this.open("权重必须为数字");
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

    },
      hotStatusHide(rowdata){
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
                this.$message({
                  type: 'success',
                  message: '设置下热门成功!'
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

      }
  }
};
</script>

<style scoped lang="scss">
  .float-l{float:left;}
  .user-div{width:100px;}
  .tabwarp tr td div.nick-div{height:25px;line-height:25px;width:60px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:4px;}
  .img-div{width:25px;height:25px;margin-left:10px;}
  .img-div img{width:100%;border-radius:50%;}
.tetxleft{text-align: left;}
.tabwarp{width:100%;border-collapse:collapse;margin:20px 0 0 20px;background-color: #fff;}
.tabwarp tr th{ background: #96ABB5;color: #fff; font-size: 12px; padding: 12px 10px;border-collapse:collapse;}
.maincontent{width: 400px;}
.tabwarp tr th.comment_count{width: 350px;}
.tabwarp tr:hover{background-color: #FAFAFA;}
.tabwarp tr td{text-align: center;font-size: 12px;color: #333;border-bottom: 1px solid #ebeef5;padding: 12px 0px;}
.tabwarp tr td div{box-sizing: border-box;    white-space: normal;    word-break: break-all;    line-height: 23px;}
.tabwarp tr td div input{display:inline-block;width:40px;border:0;border-radius: 4px;text-align: center;height:30px;line-height: 30px;}
.tabwarp tr td div input:focus{border:1px solid #dcdfe6;background-color: none;}
/*.tabwarp tr td a{display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;color: #305da1;  padding: 2px 5px;}*/
.tabwarp tr td a{position: relative;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;line-height: 25px; }
.tabwarp tr td a::after{content: "......查看全部"; position: absolute; bottom: 0; right: 0; padding-left: 60px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);}
.tabwarp tr td div img{cursor: move;}
.lh30{line-height: 30px;}
.texthandle{position: relative;overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 25px;}
.texthandle::after{content: "......查看全部"; position: absolute; bottom: -5px; right: 0; padding-left: 60px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);}
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
  .overflow-h {
    overflow: hidden;
  }
  .el-breadcrumb{float:left;height: 32px;
    line-height: 32px;
    margin-right: 20px;}
</style>
