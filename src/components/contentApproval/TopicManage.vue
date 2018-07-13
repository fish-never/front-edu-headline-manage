<template>
  <div>

    <div class="search-wrap inline">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index/contentApproval/HotpostList' }">社区管理</el-breadcrumb-item>
        <el-breadcrumb-item>话题管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="overflow-h margin-t10">
      <div class="float-l">
      <el-input v-model="content" size="small" placeholder="请输入话题关键字" clearable class="searchinput mgr20" style="width:150px;"></el-input>
      <el-input v-model="username" size="small" placeholder="请输入用户名" clearable class="searchinput mgr20" style="width:150px;"></el-input>

      <button class="search-btn" @click="getSourceList">搜索</button>
      </div>
      <div class="float-r">
      <button class="new-btn" @click="gotoEdit('')" title="新增话题">新增话题</button>
      <button class="new-btn new-btn1" @click="unPulish()" title="批量失效">批量失效</button>
      </div>
      </div>
    </div>
<div class="search-wrap">
      <table class="tabwarp">
        <tr>
          <th><input type="checkbox" :value="allpublish" v-model="allpublish" @change="changeChoose()"/></th>
          <th  class="comment_count">编号</th>
          <th>话题</th>
          <th>用户</th>
          <th>发布时间</th>
          <th>参与</th>
          <th>权重值</th>
          <th>无效有效</th>
          <th>操作</th>
          <th style="width:100px;"></th>
        </tr>
        <draggable :list="itemData" :move="getdata" @update="datadragEnd" :options="{animation: 300,handle:'.dargDiv'}"  class="div-tr" element="tbody">

            <tr v-for="(item,index) in itemData" :key="item.id"  class="list-complete-item">

              <td><input type="checkbox" :value="item.id" v-model="item.choose" /></td>
              <td><div>{{index+1}}</div></td>
              <td><router-link class="link-a tetxleft" :to="{path:'/index/TopicDetail?id='+ item.id}">{{item.name}}</router-link></td>
              <td><div>{{item.creator}}</div></td>
              <td><div>{{item.created_at}}</div></td>
              <td><div><input type="text" v-model="item.join_count" @blur="updateJoin(item)" /></div></td>
              <td><div><input type="text" v-model="item.weight"  @blur="updateweight(item)" /></div></td>
              <td><div><el-switch
                v-model="item.status"
                active-color="#13ce66" @change="updatePublish(item)"
                >
              </el-switch></div></td>
              <td>
                <div>
                  <span type="button" class="link-a" @click="gotoEdit(item.id)">编辑</span>

                </div>
              </td>
              <td><div class="dargDiv"><img src="../../assets/imgs/drag.svg" alt="" /></div></td>
            </tr>

        </draggable>

      </table>
     <!-- vuedraggable内部需要直接的v-for，而且数据源要相同，el-table的数据渲染方式导致它无法与vuedraggable搭配使用-->
</div>
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
      allpublish:false,
      loading: true,
      pageShow:false,
      content:'',
      username:'',
      value1:'',
      page:1,
      pageNum:10,
      created_at:'',
      title:'',
      itemData:[],
      total:0,
      value1: true,
      value2: true,
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
    this.verbList();
  },
  filters: {
    money: function(val) {
      let pattern = /(?=((?!\b)\d{3})+$)/g;
      return val.replace(pattern, ",");
    }
  },
  methods: {
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
      this.updateweight(this.itemData[evt.newIndex])
    },

    rnd(n,m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random>=0?random:-random; //去掉负数
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
      this.verbList();
    },
    verbList:function(){
      const params = {
        name:this.content,
        page:this.page,
        pageSize:this.pageNum,
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      const vm = this
      postList.topicList(params).then(data=>{
        if(data.code==0){
          const rdata = data.data
          loadingInstance.close();
          vm.page = parseInt(data.data.page);
          vm.pageNum = parseInt(data.data.pageSize);
          vm.total = parseInt(data.data.count);
          vm.itemData = data.data.list;
          for(var i=0;i<vm.itemData.length;i++){
            vm.itemData[i].choose=false
            if(vm.itemData[i].status==1){
              vm.itemData[i].status=true
            }else{
              vm.itemData[i].status=false
            }
          }
          //   console.log(this.itemData)
          vm.loading = false;
          vm.pageShow=true;
        }else{
          vm.open("加载失败，请重试！")
          vm.pageShow=false;
          vm.loading = false;
        }

      })
    },

    handleSizeChange(val) {
      this.pageNum = val; // 改变每页显示条数
      this.allpublish=false;
      this.verbList(); // 重新请求
    },
    handleCurrentChange(val) {
      this.page = val; // 改变页码
      this.allpublish=false;
      this.verbList(); // 重新请求
    },
    //跳转编辑页
    gotoEdit(tid){
      this.$router.push({path: '/index/TopicEdit',query:{ id:tid}});
    },
    unPulish(){
      const vm =this
      const theItem=[]
      for (var i = 0; i < vm.itemData.length; i++) {
        if(vm.itemData[i].choose === true){
          theItem.push(vm.itemData[i].id)
        }
      }
      if(theItem.length>0){
        vm.PublallUpish(theItem)
      }else{
        vm.open("请先勾选需要操作的选项！")
      }
    },
    //批量失效
    PublallUpish(ids){
      const params = {
        id:ids,
        status:0
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      const vm = this
      postList.updatePublish(params).then(data=>{
        if(data.code==0){
          const rdata = data.data
          loadingInstance.close();
          if(rdata.result==true){
            //刷新页面
            vm.verbList()
            this.allpublish=false;
          }

          vm.loading = false;
          vm.pageShow=true;
        }else{
          vm.open("修改失败，请重试！")
          vm.pageShow=false;
          vm.loading = false;
        }

      })
    },
    changeChoose(){
      const vm = this
      if(this.allpublish) {
        for (var i = 0; i < vm.itemData.length; i++) {
          vm.itemData[i].choose = true
        }
      }else{
        for (var i = 0; i < vm.itemData.length; i++) {
          vm.itemData[i].choose = false
        }
      }
    },

    updateweight(rowdata){
      const params = {
        id:parseInt(rowdata.id),
        weight:parseInt(rowdata.weight)
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      const vm = this
      if(rowdata.weight === "" || rowdata.weight == null){
        this.open("权重不能为空");
        this.verbList()
        return false;
      }else{
        if(isNaN(rowdata.weight)){
          this.open("权重必须为数字");
          this.verbList()
          return false;
        }else{
          if(parseInt(rowdata.weight)<0||parseInt(rowdata.weight)>99999){
            this.open("权重必须大于0或小于99999");
            this.verbList()
            return false;
          }else{
          postList.updateWeight(params).then(data=>{
            if(data.code==0){
              const rdata = data.data
              loadingInstance.close();
              if(rdata.result==true){
                //vm.open("修改成功")
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              }
              vm.loading = false;
              vm.pageShow=true;
            }else{
              vm.open("修改失败，请重试！")
              loadingInstance.close();
              vm.pageShow=false;
              vm.loading = false;
            }
            vm.verbList()
          })
        }}
      }

    },
    updateJoin(rowdata){
      const params = {
        id:rowdata.id,
        joinNum:rowdata.join_count
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      const vm = this
      if(rowdata.join_count === "" || rowdata.join_count == null){
        this.open("参与数不能为空");
        this.verbList()
        return false;
      }else{
        if(isNaN(rowdata.join_count)){
          this.open("参与数必须为数字");
          this.verbList()
          return false;
        }else{
          if(parseInt(rowdata.join_count)<0||parseInt(rowdata.join_count)>99999){
            this.open("参与数必须大于0或小于99999");
            this.verbList()
            return false;
          }else{
          postList.updateJoin(params).then(data=>{
            if(data.code==0){
              const rdata = data.data
              loadingInstance.close();
              if(rdata.result==true){
                //vm.open("修改成功")
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              }

              vm.loading = false;
              vm.pageShow=true;
            }else{
              vm.open("修改失败，请重试！")
              loadingInstance.close();
              vm.pageShow=false;
              vm.loading = false;
            }
            vm.verbList()
          })
        }
        }
      }
    },
    updatePublish(rowdata){
      const params = {
        id:rowdata.id,
        status:rowdata.status
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      const vm = this
      postList.updatePublish(params).then(data=>{
        if(data.code==0){
          const rdata = data.data
          loadingInstance.close();
          if(rdata.result==true){
            //vm.open("修改成功")
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }

          vm.loading = false;
          vm.pageShow=true;
        }else{
          vm.open("修改失败，请重试！")
          vm.pageShow=false;
          vm.loading = false;
        }

      })
    }
  }
};
</script>

<style scoped lang="scss">
  .margin-t10{margin-top:10px;}
  .overflow-h{overflow: hidden;}
  .float-l{float:left;}
  .float-r{float:right;}
.tetxleft{text-align: left;}
.tabwarp{width:100%;border-collapse:collapse;background-color: #fff;}
.tabwarp tr th{ background: #96ABB5;color: #fff; font-size: 12px; padding: 12px 10px;border-collapse:collapse;}
.maincontent{width: 400px;}
.tabwarp tr th.comment_count{}
.tabwarp tr:hover{background-color: #FAFAFA;}
.tabwarp tr td{text-align: center;font-size: 12px;color: #333;border-bottom: 1px solid #ebeef5;padding: 12px 0px;}
.tabwarp tr td div{box-sizing: border-box;    white-space: normal;    word-break: break-all;    line-height: 23px;}
.tabwarp tr td div input{display:inline-block;width:40px;border:0;border-radius: 4px;text-align: center;height:30px;line-height: 30px;}
.tabwarp tr td div input:focus{border:1px solid #dcdfe6;background-color: transparent;}
/*.tabwarp tr td a{display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;color: #305da1;  padding: 2px 5px;}*/
.tabwarp tr td a{position: relative;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;line-height: 25px; }

.dargDiv{cursor: move;}
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







.list-complete-item {
  transition: all 1s;
}

.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.div-tr{width:100%;}
  .new-btn{width:auto;padding:0 10px;    height: 32px;
    background: -webkit-gradient(linear, left top, right top, from(#fc9474), to(#fb745f));
    background: linear-gradient(90deg, #fc9474, #fb745f);
    border-radius: 4px;
    font-size: 14px;
    color: white;
    line-height: 14px;
    margin-left: 20px;
    cursor: pointer;}
  .new-btn1{background: transparent;border:1px solid #fb745f;color:#fb745f;}
  .el-breadcrumb{float:left;height: 32px;
    line-height: 32px;
    margin-right: 20px;}
</style>
