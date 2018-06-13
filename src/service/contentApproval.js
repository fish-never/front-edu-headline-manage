import api from '../utils/axios'
import qs from 'qs'
export default {
//获取内容列表
 getList(data){
    return api.get('post/fetch/index'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //批量通过或删除
  check(){
    return api.post('post/fetch/check',data,true).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  }

}

