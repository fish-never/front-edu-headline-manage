<template>
<div  v-loading="loading">
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池</router-link>>预览</p>
    <div class="wrap wrap-margin wrap-padding">
      <div class="item">
        <h2 class="title-p" style="font-size:24px; color:#333;line-height:25px;">{{data.title}}</h2>
        <p class="tag"><span>{{data.tag}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <p class="text" v-html="data.content"></p>
        <button class="btn">发布</button>
        <router-link  :to="{path:'/index/edit/'+data.id}" class="btn">编辑</router-link>
      </div>
    </div>

</div>
</template>

<script>
  import operationService from '../../service/operation';
export default {
  name: 'preview',
  data () {
    return {
      loading: true,
      data:[],
      id:""

    }
  },
  created(){
    this.id = this.$route.params.id
  },
  mounted(){
      if (localStorage.getItem("Token") == null) {
          this.$router.push({ path: "/" });
          return;
        }
    const params = {
       id: this.id
    };
    operationService.detailData(params).then(data=>{
      if(data.code==0){
      this.data = data.data;
      console.log(data)
      this.loading = false;
    }
    })

  }

}
</script>
<style lang="scss" scoped>
  .title-p{
    font-size:24px;
    color:#333;
    line-height:25px;
  }
  .location{
    height:60px;
    line-height:60px;
    font-size:14px;
    color:#333;
    padding-left:39px;
  }
.wrap{
  background:rgba(255,255,255,1);
  border-radius: 8px ;
  text-align: left;
  margin:0 20px 20px 20px ;
  padding:2px 23px 0 14px;
}
.item{
  padding:54px 63px;
}


  .grey{
    color:#999;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }


</style>
