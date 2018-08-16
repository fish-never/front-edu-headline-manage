<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage1"
    :page-sizes="[10, 20, 30, 40]"
    :page-size=page
    layout="total, sizes, prev, pager, next, jumper"
    :total=pageNum>
  </el-pagination>
</template>

<script>
export default {
  name: 'page',
  props: ['page','pageNum'],

  methods: {
    handleSizeChange(val) {
      this.$emit("getPage",val)
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$emit("getPageNum",val)
      console.log(`当前页: ${val}`);
    }
  },
  data() {
    return {
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4
    };
  }
}
</script>

<style>

</style>

