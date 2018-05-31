<template>
<div class="wrap">
  <div class="demo-ruleForm login">
     <div class="login-wrap">
        <p class="login-top">登录</p>
        <div class="item">
          <span class="login-text email-icon">邮箱</span>
          <input class="login-input" type="email"  v-model="username"  />
        </div>
       <div class="item">
         <span class="login-text ps-icon">密码</span>
         <input class="login-input" type="password"  v-model="password"  @keyup.enter="login" />
       </div>
       <button class="btn" @click="login">登录</button>
      </div>
  </div>
</div>
</template>

<script>
  import userService from '../service/user';
export default {
  name: 'App',
  data(){
    return {
      // username:"",
      // password: "",
      username:"sunjiatian",
      password: "xinxiliu666",
    }
  },

  methods: {
       open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    login(){
      if(this.username == ''){
        this.open('请输入邮箱');
        return
      }
      if(this.password == ''){
         this.open('请输入密码');
         return
      }
      userService.login(this.username, this.password).then(data=>{
      if(data.code==0){
        this.$router.push({path:'index'});
      }else{
        this.open("账户或密码错误")
      }

    })
    }
  }
}
</script>

<style scoped>
.wrap{
    background:url("../assets/imgs/bg.png") fixed  no-repeat center center;
    background-size:100%;
    position: fixed;
    width:100%;
    height:100%;
}
  .login{
    width:420px;
    height:460px;
    background:rgba(255,255,255,1);
    opacity:0.98;
    border-radius: 8px ;
    position: fixed;
    top:50%;
    margin-top: -230px;
    right:120px;
    padding:56px 60px 65px 60px;
  }
  @media screen and (min-width: 1400px) {
    .login{
     right:150px;

  }
  .wrap{
    background:url("../assets/imgs/bg.png") fixed  no-repeat center center;
    background-size:150%;
}
}
  .email-icon{
    background:url("../assets/imgs/email.svg") left bottom no-repeat;
  }
  .ps-icon{
    background:url("../assets/imgs/password.svg")  left bottom no-repeat;
  }
  .login-top{
    height:20px;
    font-size:20px;
    color:rgba(142,166,176,1);
    line-height:21px;
    text-align: center;;
  }
  .login-text{
    height: 20px;
    font-size: 14px;
    color: rgba(142,166,176,1);
    line-height: 27px;
    text-indent: 23px;
    position: relative;
    left:0px;
    display: inline-block;
    width: 60px;
  }
  .item{
    border-bottom:1px solid rgba(150,171,181,0.2);;
    width:297px;
    height:70px;
    line-height: 110px;
    position: relative;
    padding: 0 0;
    margin:0 0 ;
  }
  input{
    border:none;
    display: inline-block;
    position: relative;
    left: 0px;
  }
  .btn{
    width:300px;
    height:44px;
    background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
    border-radius: 4px ;
    margin-top:89px;
    border:none;
    color:#fff;
    font-size:16px;
    cursor: pointer;
  }
</style>
