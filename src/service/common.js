import api from '../utils/axios'
import qs from 'qs'
export default {

  tagList(){
    return api.get('information/tag/index').then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  typeList(){
    return api.get('information/type/index').then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  sourceList(data){
    return api.get('information/resource/source-list?'+qs.stringify(data)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 登出
  logout(){
    return api.get('login/index/logout').then((resp)=>{
      return Promise.resolve(resp.data)
    })
  }
}

