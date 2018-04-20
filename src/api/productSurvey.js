import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'productSurvey/'
export function getParams(data) {
    return axios.get(url + 'getParams', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}