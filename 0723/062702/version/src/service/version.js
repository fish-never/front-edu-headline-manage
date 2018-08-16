import api from '../utils/axios'
import qs from 'qs'
export default {
  // 获取列表
  getLists(params){
    return api.get('setting/version/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
// 详情
getInfo(id){
  return api.get('setting/version/info?'+qs.stringify(id)).then((resp)=>{
    return Promise.resolve(resp.data)
  })
},
// 新增
  add(data){
    return api.post('setting/version/add',data, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  //编辑
  update(data){
    return api.post('setting/version/update',data, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },

  // 删除
  delete(data){
    return api.post('setting/version/delete',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  }


  
  
}
