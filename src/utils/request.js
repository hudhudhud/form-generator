
import axios from 'axios'
const authedAxios = axios.create()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 需要授权信息的http请求
const http = {
    get(url, data) {
        return new Promise((resolve, reject) => {
            authedAxios.get(url, data).then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
        })
    },
    post(url, data,config) {
        return new Promise((resolve, reject) => {
            authedAxios.post(url, data, config).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

export default http
