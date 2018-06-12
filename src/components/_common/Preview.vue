<template>
<div>
    <p class="location"><span class="grey">抓取池</span>>预览</p>
    <div class="wrap">
      <div class="item">
        <h2 class="title">{{data.title}}]</h2>
        <p class="tag"><span>{{data.tag}}</span><span>{{data.source}}</span><span>{{data.created_at}}</span></p>
        <div class="text" v-html="data.content"></div>
        <button class="btn">编辑</button>
        <button class="publish-btn">发布</button>
      </div>

    </div>

</div>
</template>

<script>
  import previewService from '../service/preview';
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
    previewService.view(this.id).then(data=>{
      if(data.code==0){
      this.data = data.data;
    }
    this.itemData = data.data.result;
    }).catch(resp=>{

      })

  }

}
</script>

<style scoped>

  .location{
    height:60px;
    line-height:60px;
    font-size:14px;
    color:#333;
    padding-left:39px;
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
  .grey{
    color:#999;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }
.btn,.publish-btn{
  width:100px;
  height:36px;
  background:linear-gradient(90deg,rgba(252,148,116,1),rgba(251,116,95,1));
  border-radius: 4px ;
  color:#fff;
  font-size:16px;
}
  .publish-btn{
    background:none;
    color:#FD782D;
    margin-left:30px;
    border:1px solid #FB745F;

  }
</style>
