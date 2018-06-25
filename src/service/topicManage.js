import api from '../utils/axios'
import qs from 'qs'
export default {
  //修改话题基本信息
  updateInfo(data){
    return api.post('topic/operate/update-info',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //话题帖子浏览
  view(params){
    return api.get('post/published/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //删除话题帖子
  deletePost(data){
    return api.post('post/published/delete',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
}
