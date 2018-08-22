
import qs from 'qs'
import api from '../utils/axios'
export default {
  List(params){
    return api.get('growthplan/plan/get-plan?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  update(data){
    return api.post('growthplan/plan/update-plan',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  getDetail(params){
    return api.get('growthplan/plan/detail-plan?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  saveAdd(data){
    return api.post('growthplan/plan/add-plan',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },




}

