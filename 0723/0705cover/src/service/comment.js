import api from '../utils/axios'
import qs from 'qs'
export default {

  tagList(){
    return api.get('interaction/review/warning-list').then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  typeList(){
    return api.get('information/type/index').then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 获取评论列表
  sourceList(data){
    return api.get('interaction/review/warning-list?'+qs.stringify(data)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 显示
  
  handleList(data){
    return api.post('interaction/review/handle-warning',data,true).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
}

