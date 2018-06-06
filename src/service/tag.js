import api from '../utils/axios'
import qs from 'qs'
export default {
 
  // 分类查询
  typeList() {
    return api.get('information/type/index').then((resp) => {
      return Promise.resolve(resp.data)
    })
  },
  // 标签列表
  // tagList() {
  //   return api.get('information/tag/index?').then((resp) => {
  //     return Promise.resolve(resp.data)
  //   })
  // },
  // 分页
  pagination(params){
    return api.get('information/tag/pagination?' + qs.stringify(params)).then((resp) => {
    return Promise.resolve(resp.data)
  })
  },
  // // 预览
  // view(id) {
  //   return api.get('information/tag/view?id=' + id, true).then(resp => {
  //     return Promise.resolve(resp.data)
  //   })
  // },

  // 改变显示状态
  update(params) {
    return api.post('information/tag/update', params).then(resp => {
      return Promise.resolve(resp.data)
    })
   },
  //添加
  add(params) {
    return api.post('information/tag/add',params).then(resp => {
      return Promise.resolve(resp.data);
    })
  },
  //删除
  detele(ids) {
    return api.post('information/tag/delete', ids, true).then(resp => {
      return Promise.resolve(resp.data);
    })
  }
  
}

