
import qs from 'qs'
import api from '../utils/axios'
export default {
  verbList(params){
    return api.get('send/index/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  list(params){
    return api.get('send/reply/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  deletePush(data){
    return api.post('send/index/delete',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  sendNow(data){
    return api.post('send/index/send',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  getDetail(data){
    return api.post('send/index/detail',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  saveAdd(data){
    return api.post('send/index/add',data,true).then((resp)=>{
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

