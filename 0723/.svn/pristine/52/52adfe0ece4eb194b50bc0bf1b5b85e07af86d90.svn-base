import api from '../utils/axios'


// api.setToken('XNpxfB7AkfiApkOecp0TdlfErW4xKjI7')
// localStorage.setItem("Token", 'XNpxfB7AkfiApkOecp0TdlfErW4xKjI7')

export default {


  login(username, password){
    api.setToken(null)
    return api.post('login/index/index', {username, password}, true).then(resp=>{
      // localStorage.setItem({"Token":resp.data.data.token},{"account":resp.data.data.account},{"avatar":resp.data.data.avatar})
      localStorage.setItem("Token", resp.data.data.token)
      localStorage.setItem("account", resp.data.data.account)
      localStorage.setItem("avatar", resp.data.data.avatar)    
      api.setToken(resp.data.data.token)
      return Promise.resolve(resp.data)
    })
  }
}

