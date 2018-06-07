import Axios from 'axios'
import qs from 'qs'
let axios = Axios.create({});


if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = API_URL || "http://manage-api.ministudy.com";
    // axios.defaults.baseURL = "http://manage-api-toutiao.ministudy.com";
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL =  API_URL || "http://manage-api.ministudy.com";
    // axios.defaults.baseURL = "http://manage-api-toutiao.ministudy.com";
}
let exceptionHandler;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.responseType = 'json';
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.validateStatus = function (status) {
    return true;
};
axios.interceptors.request.use(function (config) {
    config.headers.Accept = 'application/json';
    return config;
});

axios.interceptors.response.use(function (response) {
    let data = response.data;
    let status = response.status;
    if (status === 200) {
        return Promise.resolve(response);
    } else {
        if(exceptionHandler){
            return exceptionHandler(response);
        }else{
            return Promise.reject(response);
        }
    }
});

let methods = ['get', 'post', 'put', 'delete'];
let api = {};
methods.forEach((method)=> {
    api[method] = function (uri, data, form, config) {
        if(form){
            config = Object.assign({}, config || {}, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            axios.defaults.transformRequest = [function (data) {
                return qs.stringify(data)
            }];
        }else{
            axios.defaults.transformRequest = [function (data) {
                return JSON.stringify(data)
            }];
        }
        return new Promise(function (resolve, reject) {
            axios[method](uri, data, config).then((response)=> {
                resolve(response);
            }).catch((response)=> {
                reject(response);
            })
        })
    }
});

api.setToken = function(token){
  axios.defaults.headers['Authorization'] = token;
}

api.setExceptionHandler = function(handler){
    exceptionHandler = handler;
}

export default api;
