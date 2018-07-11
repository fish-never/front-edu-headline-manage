import api from '../utils/axios'
import qs from 'qs'
export default {

  // 分页（查询）
  pagination(params){
    return api.get('post/published/index?' + qs.stringify(params)).then((resp) => {
    return Promise.resolve(resp.data)
  })
  },
   // 预览
   view(id) {
     return api.get('post/published/view?id=' + id, true).then(resp => {
       return Promise.resolve(resp.data)
     })
   },
  // 修改
  update(params) {
    return api.post('post/published/update', params).then(resp => {
      return Promise.resolve(resp.data)
    })
   },
  //删除
  detele(ids) {
    return api.post('post/published/delete', ids, true).then(resp => {
      return Promise.resolve(resp.data);
    })
  },


//话题管理
//话题列表
topicList(data){
    return api.get('topic/index/index?'+qs.stringify(data)).then(resp => {
      return Promise.resolve(resp.data);
    })
},
//修改权重
  updateWeight(params){
    return api.post('topic/operate/update-weight', params).then(resp => {
      return Promise.resolve(resp.data);
    })
  },
 //修改参与数
  updateJoin(params){
    return api.post('topic/operate/update-total', params).then(resp => {
      return Promise.resolve(resp.data);
    })
  },
  //修改有无效
  updatePublish(params){
    return api.post('topic/operate/publish', params).then(resp => {
      return Promise.resolve(resp.data);
    })
  }







}

