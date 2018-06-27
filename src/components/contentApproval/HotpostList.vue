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
      <table class="tabwarp">
        <tr>
          <th>用户</th>
          <th  class="comment_count">内容</th>
          <th>评论时间</th>
          <th>评论数</th>
          <th>浏览量</th>
          <th>点赞数</th>
          <th>转发数</th>
          <th>权重值</th>
          <th>操作</th>
          <th style="width:100px;"></th>
        </tr>  
        <draggable v-model="itemData" :move="getdata" @update="datadragEnd" element="tbody"><!--draggable会自动生成一个外层div标签导致与上面的tr不平齐，这里使用element="tbody"将其改变成tbody，也不会影响渲染的tr-->
          <tr v-for="item in itemData" :key="item.key">
          <td><div>用户</div></td>
          <td><router-link class="tetxleft" :to="{path:'/index/contentApproval/HotpostListEdit/'+ item.id}">{{item.content.content}}</router-link></td>
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
     <!-- vuedraggable内部需要直接的v-for，而且数据源要相同，el-table的数据渲染方式导致它无法与vuedraggable搭配使用-->
    <!-- <el-table   :data="itemData"    tooltip-effect="dark"  stripe   style="width: 100%"  header-align="center">
      <el-table-column   label="用户"  width="200">
        <template slot-scope="scope">
          <span class="lh30 username"><img :src="touxiang" alt="" class="userimg"></span>
          <span class="lh30 nametext">00000000</span>
        </template>
      </el-table-column>
      <el-table-column   label="内容">
        <template slot-scope="scope">
          <router-link class="link-a texthandle" :to="{path:'/index/contentApproval/HotpostListEdit/'+ scope.row.id}">{{scope.row.content.content}}</router-link>
        </template>
      </el-table-column>
      <el-table-column  label="评论时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="评论数"  width="60px" align="center">
      <template slot-scope="scope">
        <span>{{scope.row.comment_count}}</span>
      </template>
    </el-table-column>
         <el-table-column   label="浏览量" width="60px" align="center">
      <template slot-scope="scope">
         <input v-model="scope.row.read_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column  label="点赞数"  width="60px" align="center">
      <template slot-scope="scope">
         <input v-model="scope.row.like_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column  label="转发数"  width="60px" align="center">
      <template slot-scope="scope">
         <input v-model="scope.row.share_count" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column  label="权重值"  width="60px" align="center">
      <template slot-scope="scope">
         <input v-model="scope.row.weight" class="numinput" @blur="updateData(scope.row)" />
      </template>
    </el-table-column>
      <el-table-column label="操作"  width="150px" align="center">
        <template slot-scope="scope">
            <span type="button"  class="link-a" @click="hotStatusHide(scope.row)">下热门</span>
          <span  type="button"  class="link-a" @click="Detele(scope.row.id)">删除</span>
        </template>
      </el-table-column>
      <el-table-column label=""  width="150px">
        <template slot-scope="scope">
            <span type="button" @click="Detele(scope.row.id)"><img src="../../assets/imgs/drag.svg" alt="" /></span>
        </template>
      </el-table-column>
    </el-table> -->
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
    getdata(evt) {  
       //evt.draggedContext.element.id
    },  
    rnd(n,m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random>=0?random:-random; //去掉负数
    },
    datadragEnd(evt,item) {  
        console.log('拖动前的索引 :' + evt.oldIndex);
        console.log('拖动后的索引 :' + evt.newIndex); 
          if(evt.newIndex <= evt.oldIndex){ //虽然这里作了头尾索引越界处理，但是这是分页的数据，插件本身不能支持边界索引查询
         this.itemData[evt.newIndex].weight = parseInt(this.itemData[evt.newIndex+1].weight)+parseInt(this.rnd(this.itemData[evt.newIndex-1].weight,this.itemData[evt.newIndex+1].weight));
         this.updateData(this.itemData[evt.newIndex]);
          } else if(evt.newIndex > evt.oldIndex) {
            this.itemData[evt.newIndex].weight = parseInt(this.itemData[evt.newIndex-1].weight)-parseInt(this.rnd(this.itemData[evt.newIndex-1].weight,this.itemData[evt.newIndex+1].weight));
            this.updateData(this.itemData[evt.newIndex]);
           }        
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
        })
        .then(() => {
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
        })
        .catch(data => { 
          this.open(data);      
        });

      }
  }
};
</script>

<style scoped lang="scss">
.tetxleft{text-align: left;}
.tabwarp{width:100%;border-collapse:collapse;margin:20px 0 0 20px;background-color: #fff;}
.tabwarp tr th{ background: #96ABB5;color: #fff; font-size: 12px; padding: 12px 10px;border-collapse:collapse;}
.maincontent{width: 400px;}
.tabwarp tr th.comment_count{width: 400px;}
.tabwarp tr:hover{background-color: #FAFAFA;}
.tabwarp tr td{text-align: center;font-size: 12px;color: #333;border-bottom: 1px solid #ebeef5;padding: 12px 0px;}
.tabwarp tr td div{box-sizing: border-box;    white-space: normal;    word-break: break-all;    line-height: 23px;}
.tabwarp tr td div input{display:inline-block;width:40px;border:0;border-radius: 4px;text-align: center;height:30px;line-height: 30px;}
.tabwarp tr td div input:focus{border:1px solid #dcdfe6;background-color: none;}
/*.tabwarp tr td a{display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;color: #305da1;  padding: 2px 5px;}*/
.tabwarp tr td a{position: relative;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;line-height: 25px; }
.tabwarp tr td a::after{content: "......查看全部"; position: absolute; bottom: -5px; right: 0; padding-left: 60px;
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
</style>
