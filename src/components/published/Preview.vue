<template>
  <div>
    <p class="location"> <router-link to="/index/published" class="grey">已发布</router-link>>预览</p>
    <div class="wrap">
      <div class="item">
        <h2 class="title">{{data.title}}</h2>
        <p class="tag"><span>{{data.info_name}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <div class="video-wrap"  v-show="data.display_type == 4">
          <video :src="data.video_uri" controls="controls">
                您的浏览器不支持 video 标签。
              </video>
        </div>
        <div class="text"  style="font-size:16px;" v-html="data.content_html"></div>
        <router-link  :to="{path:'/index/published/edit/'+data.id}" class="btn">编辑</router-link>
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
      publishedService.view(this.id).then(data=>{
        if(data.code==0){
        this.data = data.data;
        console.log(data)
      }
    })

    }

  }
</script>

<style scoped>

.video-wrap{
  margin-bottom:20px;
}
  .wrap{
    /*display: table-cell;*/
    /*overflow-y: scroll;*/
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    text-align: left;
    margin:0 20px 20px 20px ;
    padding:2px 23px 0 14px;
  }
  .item{
    padding:54px 63px;
  }
  .title{
    font-size:24px;
    color:#333;
    line-height:25px;
  }
  .tag{
    font-size:12px;
    color:#B3B3B3;
    line-height:12px;
    margin:19px 0 39px 0;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }
  .btn{
    width:100px;
    height:36px;
    background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
    border-radius: 4px ;
    color:#fff;
    font-size:16px;
    display: block;
    text-align: center;
    line-height: 36px;
    float:none;
    margin:30px 0 0 0;
  }

</style>
