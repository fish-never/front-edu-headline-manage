import api from '../utils/axios'
import qs from 'qs'
export default {

  list(params){
    return api.get('information/resource/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  sourceList(data){
    return api.get('information/resource/source-list?'+qs.stringify(data)).then((resp)=>{
    return Promise.resolve(resp.data)
  })
},
  editData(id){
    return api.get('information/resource/view?id='+id, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  // 编辑后保存
  saveData(data){
    return api.post('information/resource/update',data, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  // 发布
  publishData(id){
    return api.post('information/resource/publish',id, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  // 获取详情
  view(id){
    return api.get('information/resource/view?id='+id, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
    //markEdited
  
    markEdited(id){
      return api.post('information/resource/mark-edited',id, true).then(resp=>{
          return Promise.resolve(resp.data)
        })
    }, 
  
  //delete
  detele(ids){
    return api.post('information/resource/delete',ids, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },



}

