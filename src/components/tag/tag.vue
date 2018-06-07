<template>
  <div>
    <div class="clearfloat wrap-main">
      <div class="search-wrap">
        <span class="title">检索条件</span>
        <el-select v-model="tag_name" size="small" clearable filterable placeholder="标签名称" style="width:150px;"><!--v-model默认显示的只是初始值，关联值自然是根据el-option的选择而变化（显示为:label，值为：value）-->
        <el-option
          v-for="item in tagList"
          :label="item.tag_name" 
          :key="item.id" 
          :value="item.id"> <!--:label和:value绑定到数据源tagList的属性，其中:label对应显示文字，:value对应值（传给select），注意:key对应也是值-->
        </el-option>
      </el-select>
        <el-select v-model="typeName" clearable filterable size="small" placeholder="对应分类" style="width:150px;">
          <el-option
            v-for="item in types"
            :label="item.typeName"
            :key="item.id" 
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="isdefault" size="small" filterable clearable placeholder="默认展示" style="width:150px;">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        
        <button class="search-btn" @click="getSourceList">搜索</button>
        <button class="newadd-btn" @click="newadd" title="新增">新增</button>
         <button class="detele-btn" @click="deleteLists" title="删除">删除</button>
      </div>
    </div>
    <el-table
      :data="itemData"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      class="wrap-margin"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
        </el-table-column><!--多选: 手动添加一个el-table-column，设type属性为selection即可-->
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column   label="标签名称"  width="200">
        <template slot-scope="scope"><!-- 普通情况可以使用prop属性直接接受参数，这里为了表格可以编辑并将子组件的值传到父组件供使用，使用了slot-scope。vue原生slot-scope的值将被用作一个临时变量名接收父组件传过来的值, 而在element中的table对slot-scope的值封装成了一个大对象（这里slot-scope对应的就是:data绑定的数据源对象）,对象里面有属性row(行),column(列),$index(索引),store,所以我们可以通过scope.row拿到对应的单个值.-->
          <span>{{ scope.row.tag_name }}</span>
        </template>
      </el-table-column><!--若给el-table-column加上show-overflow-tooltip="true"，文字超过一行自动出现省略号，鼠标悬停时以Tooltip形式显示全部内容-->
      <el-table-column
        label="对应分类">
        <template slot-scope="scope">
          <span>{{ scope.row.type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column   label="备注" >
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="默认展示">
        <template slot-scope="scope"  width="100px">
          <template>
          <el-radio v-model="scope.row.is_default" label="1" @change="radiochange(scope.row)">是</el-radio>
          <el-radio v-model="scope.row.is_default" label="0" @change="radiochange(scope.row)">否</el-radio>
        </template>
        </template>
      </el-table-column> -->
      <el-table-column
      label="状态"  width="140">
      <template slot-scope="scope">
        <span  v-if="scope.row.is_default==0">
          隐藏
        </span>
        <span v-if="scope.row.is_default==1">
          显示
        </span>
      </template>
      </el-table-column>
      <el-table-column label="操作"  width="150px">
        <template slot-scope="scope">
          <span class="link-a" type="button" @click="Detele(scope.row.id)">删除</span>
           <span class="link-status"  v-if="scope.row.is_default==0"  @click="updataStatusShow(scope.row)">显示</span>
        <span class="link-status"  v-if="scope.row.is_default==1" @click="updataStatusHide(scope.row)" >隐藏</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-wrap"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10,50,100,200,500,1000,2000,3000]"
      :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"><!-- current-page当前页数，支持 .sync 修饰符；page-size	每页显示条目个数；page-sizes	每页显示个数选择器的选项设置；layout	组件布局，子组件名用逗号分隔；total	总条目数 -->
    </el-pagination><!-- size-change	pageSize改变时会触发（也就是page-sizes值改变）；current-change	currentPage 改变时会触发。前后翻函数未定义却可以使用？-->



    <el-dialog title="添加标签类型" :visible.sync="dialognewadd" width="65%">
      <el-form :model="formdata" :rules="rules">
        <el-form-item label="标签名称" :label-width="formLabelWidth" prop="tagname" required style="width:95%;"><!-- 父级:rules加prop完成验证-->
          <el-input v-model="formdata.tagname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" style="width:95%;">
          <el-input type="textarea" v-model="formdata.remark" ></el-input>
        </el-form-item>
        <el-form-item label="对应分类" required style="margin-left:22px;">
          <div style="margin-left:82px;">
            <el-checkbox-group v-model="checkclassify" @change="newaddChange">
            <el-checkbox v-for="item in tagList" :label="item.tag_name" :key="item.id" :value="item.id">{{item.tag_name}}</el-checkbox>
            </el-checkbox-group>
          </div>
      </el-form-item>
      <el-form-item label="默认显示"  style="margin-left:22px;">
        <div style="margin-left:82px;">
          <el-checkbox-group v-model="checkTags">
            <el-checkbox v-for="item in showTags" :label="item" :key="item.id"  :value="item" >{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialognewadd = false">取 消</el-button>
        <el-button type="primary" @click="newadding()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tagService from "../../service/tag"; //控制器
export default {
  name: "grab",
  data() {
    return {
      pageShow: false,
      itemData: [],
      page: 1,
      ids: "",
      dialognewadd: false,
      tagList: [],
      types: "",
      total: 10,
      pageNum: 10,
      typeid: "",
      tag_name: "",
      typeName:"",
      isdefault: "",
      options2: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ],
      checkclassify: [],// 总分类被选中的，没有意义
      showTags:[],  // 默认展示的标签
      checkTags:[], // 被选中的标签
      tagcomplement:[], //差集
      formdata: {
        tagname: "",
        remark: ""
      },
      formLabelWidth: "100px",
      rules: {
        tagname: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1 到10个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请填写备注",trigger: "blur"},
          { min: 1, max: 50, message: "长度在 1 到 50 个字符",trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (localStorage.getItem("account") == null) {
      // 没有登录信息即要跳到登录页面
      this.$router.push({ path: "/" });
      return;
    }
    this.loadList();
    tagService.typeList().then(data => {
      if (data.code == 0) {
        this.types = data.data;
        //  console.log(this.types)
      }
    });
    tagService.tagList().then(data => {
      if (data.code == 0) {
        this.tagList = data.data;
      }
    });

  },
  watch: {
    // classifycheck: function(check) {
    //   check.forEach(item => {
    //     if (this.checkTags.indexOf(item) == -1) {
    //       this.checkTags = item + "," + this.checkTags;
    //     }
    //     this.checkTags = this.checkTags.replace(/,$/, "");
    //   });
    // }
  },
  methods: {
    //弹框
    open(text) {
      this.$alert(text, "信息", {
        confirmButtonText: "确定"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = "";
      val.forEach(item => {
        this.ids = item.id + "," + this.ids;
      });
      this.ids = this.ids.replace(/,$/, "");
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
      this.loadList();
    },
    loadList() {
      const params = {
        page: this.page,
        pageNum: this.pageNum,
        is_default: this.isdefault,
        tag_name: this.tag_name,
        type_id: this.typeid
      };
      const loadingInstance = this.$loading({ fullscreen: true });
      tagService.pagination(params).then(data => {
        if (data.code == 0) {
          loadingInstance.close();
          this.page = parseInt(data.data.page);
          this.pageNum = parseInt(data.data.pageNum);
          this.total = parseInt(data.data.count);
          this.itemData = data.data.result;
          this.pageShow = true;
        } else {
          this.pageShow = false;
        }
      });
    },
    Detele(ids) {
      const params = {
        ids: ids
      };
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          tagService.detele(params).then(data => {
            if (data.code == 0) {
              this.loadList();
            } else {
              this.open(data.msg);
            }
          });
        })
        .then(() => {
          //第二个then的含义？
          // alert("99");
        });
    },
    newadd() {
      this.formdata.tagname = "";
       this.formdata.remark = "";
       this.tagcomplement = [];
      this.dialognewadd = true;
    },
    //删除
    deleteLists() {
      if (this.ids.length > 0) {
        const params = {
          ids: this.ids
        };
        this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            tagService.detele(params).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
          })
          .catch(() => {});
      } else {
        this.open("请先对需要删除的数据进行勾选");
      }
    },
    handleSizeChange(val) {
      this.pageNum = val; // 改变每页显示条数
      this.loadList(); // 重新请求
    },
    handleCurrentChange(val) {
      this.page = val; // 改变页码
      this.loadList(); // 重新请求
    },
    complement(a, b){ // 求差集，a数组元素比b多
      const c = [];
      for(let i=0; i < a.length; i++){   
       let flag = true;   
        for(let j=0; j < b.length; j++){   
            if(a[i] == b[j])   
            flag = false;   
        }   
        if(flag){  
        c.push(a[i]); 
        }   
    } 
    return c;   
    },
    getTagsid(){//emlment-ui复选框只能获取显示和值其中的一种，故需要重新匹配来获取另一个
     const tagspost = {};
     this.tagcomplement = this.complement(this.showTags, this.checkTags);
    // console.log(JSON.stringify(this.tagList));
   //  console.log(JSON.stringify(this.tagcomplement));
    // console.log(JSON.stringify(this.checkTags));
          this.tagList.forEach(item => {
         this.checkTags.forEach(item02 => {
        if (item.tag_name == item02) {
          tagspost[item.id] = "1";
          }
        });
        this.tagcomplement.forEach(item03 => {
         if (item.tag_name == item03) {
         tagspost[item.id] = "0";
        }
      });
      }); 
      return tagspost;
    },
    newadding(){
      if(!this.formdata.tagname){
       this.open("请填写标签名称");
       return false;
     }
     if(this.showTags.length <= 0){ //this.tagcomplement和this.checkTags可以为空
       this.open("请选择标签");
       return false;
     }
    //  console.log(this.formdata.tagname.toString());
    //   console.log(this.formdata.remark);
    //   console.log(JSON.stringify(this.getTagsid()));
      tagService.add({
          tag_name:JSON.stringify(this.formdata.tagname), 
          remark:this.formdata.remark,
          type_json:JSON.stringify(this.getTagsid())
        }).then(data => {
              if (data.code == 0) {
                this.dialognewadd = false;
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
    },
    newaddChange(val) {
      //console.log(JSON.stringify(this.classifycheck));
      this.checkTags = val;
      this.showTags = val;
    },
    radiochange(rowdata){
      tagService.update({
          id:rowdata.id,
          remark:rowdata.remark,
          is_default:rowdata.is_default,
          type_id:rowdata.type_id,
          tag_name:rowdata.tag_name
         }).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
    },
    updataStatusShow(rowdata){
         this.$confirm('确定显示?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          tagService.update({
          id:rowdata.id,
          remark:rowdata.remark,
          is_default:1,
          type_id:rowdata.type_id,
          tag_name:rowdata.tag_name
         }).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
        }).catch(() => {       
        });

      },
      updataStatusHide(rowdata){
        this.$confirm('确定隐藏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        tagService.update({
          id:rowdata.id,
          remark:rowdata.remark,
          is_default:0,
          type_id:rowdata.type_id,
          tag_name:rowdata.tag_name
         }).then(data => {
              if (data.code == 0) {
                this.loadList();
              } else {
                this.open(data.msg);
              }
            });
        }).catch(() => {       
        });

      }
  }
};
</script>

<style scoped lang="scss">
.link-a:visited {
  color: red;
}
a:visited {
  color: red;
}
.red {
  color: red;
}
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
</style>
