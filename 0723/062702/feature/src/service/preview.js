import api from '../utils/axios'
import qs from 'qs'
export default {

  view(id){
    return api.get('information/resource/view?id='+id, true).then(resp=>{
      return Promise.resolve(resp.data)
    })
  }
}
