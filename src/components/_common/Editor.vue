<template>
    <editor id="editor_id" height="500px" width="100%" :content="content"
        :afterChange="afterChange()"
        :loadStyleMode="false"
        pluginsPath="/static/kindeditor/plugins/"
        :items="['source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
      'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
      'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
      'superscript', 'quickformat', 'selectall', '|', 'fullscreen',
      'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
      'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 
        'table', 'hr', 'pagebreak',
      'anchor', 'link', 'unlink', '|', 'upimage', 'upmedia', 'clearcode']" 
      :htmlTags="{
      font: ['color', 'size', 'face', '.background-color'],
      span: ['style'],
      div: ['class', 'align', 'style'],
      table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],
      'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style'],
      a: ['class', 'href', 'target', 'name', 'style'],
      video: ['src', 'width', 'height', 'type', 'loop', 'autoplay', 'quality','controls',
        'style', 'align', 'allowscriptaccess', '/'],
      embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality',
        'style', 'align', 'allowscriptaccess', '/'],
      img: ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],
      hr: ['class', '/'],
      br: ['/'],
      'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': ['align', 'style'],
      'tbody,tr,strong,b,sub,sup,em,i,u,strike': []
    }"
        @on-content-change="onContentChange"></editor>
</template>

<script>
import Vue from 'vue'
import router from '../../router'


export default {
  name: "XEditor",
  props: ['content'],
  data() {
    return {
      
    };
  },
 
  mounted(){

  },
  watch: {
    content: function(val) {
   
    }
  },
  methods: {
    onContentChange: function(val){
     this.$emit('change', val)
    },
    afterChange: function(val){

    }
  }
};
</script>

<style scoped>
</style>
