<template>
  <div>
    <p class="location"><span class="grey">抓取池</span>>预览</p>
  <div>
    <textarea :id= "Id" v-model="content"></textarea>
  </div>

    <div class="wrap-margin wrap-padding">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
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
          <!--<el-col class="line" :span="2">-</el-col>-->
          <!--<el-col :span="11">-->
            <!--<el-form-item prop="date2">-->
              <!--<el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-form-item>
        <el-form-item label="分类" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择分类">
            <el-option label="分类1" value="shanghai"></el-option>
            <el-option label="分类2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="region">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">无图</el-radio>
            <el-radio :label="6">单张大图</el-radio>
            <el-radio :label="7">单张小图</el-radio>
            <el-radio :label="9">三图</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="新增标签" prop="type">
          <el-input v-model="inputTags" placeholder="请输入内容"></el-input>
          <el-checkbox-group
            v-model="checkedCities1">
            <el-checkbox v-for="item in tags" :label="item" :key="item" :value="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import grabService from "../service/grab";
const tagOptions = ["自考专题1", "自考专题2", "自考专题3", "自考专题4"];
export default {
  name: "edit",
  data() {
    return {
      Id: "xxx",
      Editor: null,
      DefaultConfig: {},

      radio2: "",
      content: "xxx",
      input: "",
      inputTags: "",
      checkedCities1: [],
      tags: tagOptions,
      id: "",
      ruleForm: {},

    };
  },
  props: {
    value: {
      default: "",
      type: String
    },
    config: {
      type: Object,
      default: () => {
        return {
          height: 300,
          plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount spellchecker imagetools contextmenu colorpicker textpattern help',
          toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
          image_advtab: true,
        };
      }
    }
  },

  watch: {
    content: function(val) {
      console.log(val);
    },
    inputTags: function(val) {
      this.checkedCities1 = [];
      this.tags.forEach(item => {
        if (val.indexOf(item) != -1) {
          this.checkedCities1.push(item);
        }
      });
    },
    checkedCities1: function(val) {
      this.tags.forEach(item => {
        this.inputTags = this.inputTags.replace(item + ",", "");
      });
      val.forEach(item => {
        if (this.inputTags.indexOf(item) == -1) {
          this.inputTags = item + "," + this.inputTags;
        }
      });
    }
  },
  methods: {
    init2: function() {
      const self = this;
      this.Editor = window.tinymce.init({
        // 默认配置
        ...this.DefaultConfig,

        // prop内传入的的config
        ...this.config,

        // 挂载的DOM对象
        selector: `#xxx`,

        setup: editor => {
          // 抛出 'on-ready' 事件钩子
          editor.on("init", () => {
            self.loading = false;
            self.$emit("on-ready");
            editor.setContent(self.content);
          });
          editor.on("input change undo redo", () => {
            self.content = editor.getContent()
            self.$emit("input", editor.getContent());
          });
        }
      });
    }
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    this.init2();
    grabService.editData(this.id).then(data => {
      if (data.code == 0) {
        this.ruleForm = data.data;
      }
    });
  },
  components: {}
};
</script>

<style scoped>
.item-wrap {
  width: 290px;
  height: 258px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  float: left;
  text-align: left;
  margin: 20px;
  padding: 2px 23px 0 14px;
}
.title {
  font-size: 16px;
  color: rgba(52, 71, 80, 1);
  line-height: 22px;
}
.tag {
  font-size: 12px;
  color: rgba(179, 179, 179, 0.99);
  line-height: 12px;
}
.text {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
}
</style>
