import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'finance/'
// 上传资金数据
export function upload1(data) {
    return axios.post(url + 'upload1', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}