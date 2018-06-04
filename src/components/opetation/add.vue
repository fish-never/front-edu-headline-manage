<template>
  <div>
    <p class="location"><router-link to="/index/operationStorage" class="grey">运营池</router-link>>新建</p>
    <div class="wrap-margin wrap-padding">
        <editor id="editor_id" height="500px" width="100%" :content="ruleForm.content"
            :afterChange="afterChange()"
            pluginsPath="/static/kindeditor/plugins/"
            :loadStyleMode="false"
            :items="          ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
          'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
          'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
          'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
          'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
          'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
           'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
          'anchor', 'link', 'unlink', '|', 'upimage']"
            @on-content-change="onContentChange"></editor>
    </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="ruleForm.coverage"></el-input>
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
          <el-input v-model="ruleForm.source"></el-input>
        </el-form-item>
        <el-form-item label="时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.created_at" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="region">
          <el-select v-model="ruleForm.type_id" placeholder="请选择分类">
            <el-option v-for="item in types" :label="item.typeName" :key="item.id" :value="item.id">{{item.typeName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="region">
          <el-radio-group v-model="ruleForm.display_type">
            <el-radio :label="1">无图</el-radio>
            <el-radio :label="2">单张大图</el-radio>
            <el-radio :label="3">单张小图</el-radio>
            <el-radio :label="4">三图</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedCities1">
            <el-checkbox v-for="item in tags" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input v-model="ruleForm.read_count" placeholder="" type="num"></el-input>
        </el-form-item>
        <el-form-item label="评论数" >
          <el-input v-model="ruleForm.comment_count " placeholder=""  type="num"></el-input>
        </el-form-item>
        <el-form-item label="点赞数">
          <el-input v-model="ruleForm.like_count" placeholder=""  type="num"></el-input>
        </el-form-item>
        <el-form-item label="转发数" >
          <el-input v-model="ruleForm.share_count" placeholder=""  type="num"></el-input>
        </el-form-item>

        <el-form-item>
          <button @click="saveData" class="btn">保存并预览</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import operationService from '../../service/operation';
  import commonService from '../../service/common';
  export default {
    name: 'edit',
    data () {
      return {
        radio2: 1,
        input:'',
        editorText:"",
        inputTags:'',
        checkedCities1: [],
        tags: [],
        id:'',
        ruleForm:{},
        types:""

      }
    },
    created(){
      this.id = this.$route.params.id
    },
    watch:{
      inputTags: function(val){
        this.checkedCities1 = []
        this.tags.forEach(item=>{
          if(val.indexOf(item.tag_name) != -1){
          this.checkedCities1.push(item.tag_name)
        }
      })
      },
      checkedCities1: function(val){
        this.tags.forEach(item=>{
          this.inputTags = this.inputTags.replace(item.tag_name+',', '')
      })
        val.forEach(item=>{
          if(this.inputTags.indexOf(item) == -1){
          this.inputTags = item + ',' + this.inputTags
        }
      })
      }
    },
    methods:{
    onContentChange (val) {
      this.ruleForm.content = val;
    },
    afterChange () {
    }
    },
    created(){
      this.id = this.$route.params.id
    },
    mounted(){
//      operationService.detailData(this.id).then(data=>{
//        if(data.code==0){
//        this.ruleForm = data.data;
//        console.log(this.ruleForm)
//      }
//    }),
      commonService.typeList().then(data => {
        if(data.code == 0){
        this.types = data.data;
      }
    }),
      commonService.tagList().then(data => {
        if(data.code == 0){
        console.log(data)
        this.tags = data.data;
      }
    })

    },
  }
</script>

<style scoped>
  .item-wrap{
    width:290px;
    height:258px;
    background:rgba(255,255,255,1);
    border-radius: 8px ;
    float:left;
    text-align: left;
    margin:20px;
    padding:2px 23px 0 14px;
  }
  .title{
    font-size:16px;
    color:rgba(52,71,80,1);
    line-height:22px;
  }
  .tag{
    font-size:12px;
    color:rgba(179,179,179,0.99);
    line-height:12px;
  }
  .text{
    font-size:12px;
    color:rgba(102,102,102,1);
    line-height:20px;
  }

</style>
