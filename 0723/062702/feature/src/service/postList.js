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
  }
  
}

