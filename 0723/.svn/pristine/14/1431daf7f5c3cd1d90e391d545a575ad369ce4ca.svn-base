<template>
<div  v-loading="loading">
    <p class="location"><router-link class="grey" to="/index">抓取池</router-link>>预览</p>
    <div class="wrap wrap-margin wrap-padding">
      <div class="item">
        <h2 class="title-p" style="font-size:24px; color:#333;line-height:25px;">{{data.title}}</h2>
        <p class="tag"><span>{{data.tag}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <div class="text" style="font-size:16px;" v-html="data.content"></div>
        <div class="clearfloat" style="margin-top:30px;">
          <button class="btn" @click="publishData">发布</button>
          <router-link  :to="{path:'/index/edit/'+id}" class="publish-btn">编辑</router-link>
        </div>
    
      </div>
        
    </div>

</div>
</template>

<script>
  import grabService from '../../service/grab';
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
  methods:{
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    publishData(){
      this.data.id = this.data._id;
      grabService.publishData(this.data).then(data=>{
        if(data.code==0){
            this.$router.push({path:'../../index'});
      }else{
        this.open(data.msg)
      }
    })

    }
  },
  mounted(){
    grabService.view(this.id).then(data=>{
      if(data.code==0){
      this.data = data.data;
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
