<template>
  <el-container>
    <el-header class="herder-wrap">
        <el-col :span="14"><img src="../../assets/imgs/logo.svg" align="center"/></el-col>
        <el-col :span="10" class="header-right">
          <img :src="avatar" width=30 align="center" />
          {{account}}<span style="background: #E3E3E3;height:8px ;width:1px;display:inline-block;margin:0 10px;"></span>
          <p class='logout' @click="logout">退出登录</p>
          </el-col>
      </el-header>
    <el-container>
      <el-aside width="200px" class="side-bar">
        <el-col :span="24">
          <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened="true" @open="handleOpen" @close="handleClose">
              <el-menu-item index="/index" dataId="1" :class="{curr: curid==1}" @click="goto($event,'/index')" dataPath="/index">
                <!-- <i class="el-icon-setting"></i> -->
              <i class="icon1 icon" :class="{curr1: path=='/index/index'}"></i>
                <span>抓取池</span>
            </el-menu-item>
            <el-menu-item index="2"  dataId="2" :class="{curr: curid==2}" @click="goto($event,'/index/operationStorage')" dataPath="/index/operationStorage">
              <i class="icon2 icon" :class="{curr2: path=='/index/operationStorage'}"></i>
                <span>运营池</span>
            </el-menu-item>
            <el-menu-item index="3" dataId="3" :class="{curr: curid==3}" @click="goto($event)" dataPath="/index/published">
              <i class="icon3 icon" :class="{curr3: path=='/index/published'}"></i>
                <span>已发布</span>
            </el-menu-item>
            <el-menu-item index="4" dataId="4" :class="{curr: curid==4}" @click="goto($event)" dataPath="/index/comment">
             <i class="icon4 icon" :class="{curr4: path=='/index/comment'}"></i>
              <span>评论管理</span>
            </el-menu-item>
            <el-menu-item index="5" dataId="5" :class="{curr: curid==5}" @click="goto($event)" dataPath="/index/tag">
             <i class="icon5 icon" :class="{curr5: path=='/index/tag'}"></i>
              <span>标签管理</span>
            </el-menu-item>
             <el-submenu index="6" indexPath="/index/contentApproval/index" dataId="6" :class="{curr: curid==6}" @click="goto($event)">
                  <template slot="title" >
                    <i class="icon6 icon" :class="{curr6:curid==6}"></i>
                    <span>社区管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="6-1"  @click="gotoChild('/index/contentApproval/index')">内容审核</el-menu-item>
                    <el-menu-item index="6-2"  @click="gotoChild('/index/contentApproval/PublishingPool')">发布池内容管理</el-menu-item>
                    <el-menu-item index="6-3"  @click="gotoChild('/index/contentApproval/HotpostList')">热帖列表</el-menu-item>
                    <el-menu-item index="6-4" @click="gotoChild('/index/contentApproval/HotpostList')">话题管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
            <el-submenu index="7"  indexPath="/index/push/index" dataId="7" :class="{curr: curid==7}" @click="goto($event)">
              <template slot="title" >
                <i class="icon7 icon" :class="{curr7:curid==7}"></i>
                <span>推送管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="7-1"  @click="gotoChild('/index/push/index')">运营推送管理</el-menu-item>
                <el-menu-item index="7-2"  @click="gotoChild('/index/push/reply')">回复推送管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container class="main-bg">
        <el-main class="">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import commonService from "../../service/common";
export default {
  name: 'index',
  data () {
    return {
      path: '/index',
      curid:0,
      msg: '',
      account:'',
      avatar:"",
      flag:false,
      flag01:false
    }
  },
  mounted(){
    this.avatar = localStorage.getItem("avatar");
    this.account = localStorage.getItem("account");
  },
  methods:{
       handleOpen(key, keyPath) {
        this.flag = true;
        this.flag01=true;
        this.curid=key
        //this.path = '/index/contentApproval/index';
        this.$router.push(keyPath);
      },
      handleClose(key, keyPath) {
        this.flag = true;
        this.flag01=true;
        this.curid=key
        //this.path = '/index/contentApproval/index';
        this.$router.push(keyPath);
      },
    // logout
    logout(){
     commonService.logout().then(data => {
          if (data.code == 0) {
            localStorage.clear();
            this.$router.push({path:'/'});
          }
        });
    },
    goto:function(e){
      this.flag = false;
      this.curid=e.$attrs.dataId
      //this.path = path;
      this.$router.push(e.$attrs.dataPath);
    },
    gotoChild:function(path){
      this.flag = true;
      this.flag01=true;
      //this.path = path;
      this.$router.push(path);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  html{
    background:#F3F5F7;
  }
</style>
<style  lang="scss" scoped>
.el-menu-item.is-active{
  color:#FD782D;
}
.logout{
  color:#FD782D;
  display:inline-block;
  cursor: pointer;
}
.header-right{
  line-height:60px;
  text-align: right;
  color:#666;
  font-size:12px;
  padding-right:48px;
  img{
    margin-right:13px;
  }

}
  .icon{
     width:20px;
     height:20px;
     display: inline-block;
     margin-right:5px;
  }
  .icon1{
     background:url("../../assets/imgs/icon1.svg") center center no-repeat;
}
  .icon2{
     background:url("../../assets/imgs/icon2.svg") center center no-repeat;
}
  .icon3{
     background:url("../../assets/imgs/icon3.svg") center center no-repeat;
}
  .icon4{
     background:url("../../assets/imgs/icon4.svg") center center no-repeat;
}
.icon5{
     background:url("../../assets/imgs/icon5.svg") center center no-repeat;
}
.icon6{
     background:url("../../assets/imgs/icon66.svg") center center no-repeat;
}
  .curr1{
     background:url("../../assets/imgs/icon11.svg") center center no-repeat;
}
  .curr2{
     background:url("../../assets/imgs/icon22.svg") center center no-repeat;
}
  .curr3{
     background:url("../../assets/imgs/icon33.svg") center center no-repeat;
}
  .curr4{
     background:url("../../assets/imgs/icon44.svg") center center no-repeat;
}
.curr4{
     background:url("../../assets/imgs/icon44.svg") center center no-repeat;
}
.curr5{
     background:url("../../assets/imgs/icon55.svg") center center no-repeat;
}
.curr6{
     background:url("../../assets/imgs/icon6.svg") center center no-repeat;
}
.curr7{
  background:url("../../assets/imgs/icon6.svg") center center no-repeat;
}
  .el-main{
    padding:0;
    padding-right: 40px;
  }
  .side-bar{
    width:200px;
    height:100%;
    position: fixed;
    z-index:888;
    left:0;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 11px 6px rgba(0,0,0,0.04);
    padding-top:60px;
    display: table-cell;
    span{
      color:#96ABB5;
      font-size:16px;
    }
  }
  .herder-wrap{
    position: fixed;
    top:0;
    z-index:9999;
    height:60px;
    background:#fff;
    width:100%;
    line-height: 60px;
    text-align: left;
    color:#000;
    font-size:17px;
  }
  .main-bg{
    background:#F3F5F7;
    // overflow-y: scroll;
    /*min-height:500px;*/
    position:absolute;
    top:0;
    left:0;
    height:100%;
    padding:60px 0px 0px 220px;
    width:100%;
  }
  .curr{
    background: #FFFBF8;
    border-left:6px solid #FD782D;
    span{
      color:#FD782D;
    }
  }
</style>
