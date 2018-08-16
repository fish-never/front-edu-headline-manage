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
    //  运营文章发布
    publishData(data){
      return api.post('information/operation/publish',data,true).then((resp)=>{
          return Promise.resolve(resp)
        })
    },
  // 获取评论列表
  sourceList(data){
    return api.get('information/operation/index?'+qs.stringify(data)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 获取运营文章来源(部门)的列表
  sourceData(){
    return api.get('information/operation/source-list').then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 获取运营文章创建
  newData(data){
    return api.post('information/operation/add',data,true).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 运营文章编辑
  editData(data){
    return api.post('information/operation/update',data,true).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
    //  运营文章发布软删除(批量)
    deleteData(ids){
      return api.post('information/operation/delete',ids,true).then((resp)=>{
          return Promise.resolve(resp.data)
        })
    },
  //  获取运营文章详情
  detailData(id){
    return api.get('information/operation/view?'+qs.stringify(id)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },


}

