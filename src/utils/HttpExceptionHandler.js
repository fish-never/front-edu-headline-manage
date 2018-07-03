
import axios from './axios'
import userService from '../service/user'


//处理通用网络异常
export default {
    init(app){
        axios.setExceptionHandler(function(resp){
            console.log(888)
            console.log(resp)
            switch(resp.status){
                case 403:
                    window.location = './'
                    break;

            }
        })
    }
}
