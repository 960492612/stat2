import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'login/'
export function login(data) {
    return axios.post(url + 'login',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function isLogin(token) {
    return axios.get(url + 'isLogin',  {params:{token}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}
