import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'record/'

export function addRecords(data) {
    return axios.post(url + 'addRecords',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function getSubjectsRocordBySid(sid) {
    return axios.get(url + 'getSubjectsRocordBySid',  {params:{sid}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getRecords(params) {
    return axios.get(url + 'getRecords', { params: {params} }).then((res) => {
        return Promise.resolve(res.data)
    })
}