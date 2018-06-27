<template>
<div  v-loading="loading">
    <p class="location"> <router-link to="/index/published" class="grey">已发布</router-link>>预览</p>
    <div class="wrap wrap-margin wrap-padding">
      <div class="item">
        <h2 class="title-p" style="font-size:24px; color:#333;line-height:25px;">{{data.title}}</h2>
        <p class="tag"><span>{{data.tag}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <div class="video-wrap"  v-show="data.display_type == 4">
          <video :src="data.video_uri" controls="controls">
                您的浏览器不支持 video 标签。
              </video>
        </div>
        <p class="text" v-html="data.content_html"  style="font-size:16px;"></p>
        <div style="margin-top:30px;">
         <button class="btn" @click="publishData">发布</button>
         <router-link  :to="{path:'/index/published/edit/'+data.id}" class="publish-btn">编辑</router-link>
        </div>
      </div>
    </div>

</div>
</template>

<script>
import publishedService from '../../service/published';
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
     if (localStorage.getItem("account") == null) {
          this.$router.push({ path: "/" });
          return;
        }
    publishedService.view(this.id).then(data=>{
      if(data.code==0){
      this.data = data.data;
      console.log(data)
      this.loading = false;
    }
    })

  },
  methods:{
        //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    publishData(){
      const params = {
        id:this.id,
        status: 0
      }
    publishedService.publishData(params).then(data=>{
      if(data.code==0){
      this.$router.push({ path: "../../../index/published"});
    }else{
      this.open(data.msg)
    }
    })
    }
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
