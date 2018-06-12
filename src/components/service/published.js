import api from '../utils/axios'
import qs from 'qs'
export default {
  // 保存并预览
previewData(data){
  return api.post('information/publish/update',data,true).then((resp)=>{
    return Promise.resolve(resp.data)
  })
},
// 发布
publishData(data){
  return api.post('information/publish/status',data,true).then((resp)=>{
    return Promise.resolve(resp.data)
  })
},
  updataStatus(data){
    return api.post('information/publish/status',data, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  sourceList(params){
    return api.get('information/publish/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  view(id){
    return api.get('information/publish/view?id='+id, true).then(resp=>{
        return Promise.resolve(resp.data)
      })
  },
  sourceData(){
    return api.get('information/publish/source-list').then((resp)=>{
      return Promise.resolve(resp.data)
    })
  }


  
  
}
