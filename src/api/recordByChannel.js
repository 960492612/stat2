import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'recordByChannel/'

export function addRecords(data) {
    return axios.post(url + 'addRecords',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}
// 检测是否已添过该渠道在该时段的记录
export function checkDataByDateAndChannel(data) {
    return axios.get(url + 'checkDataByDateAndChannel',  {params: data}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getRecordList(data) {
    return axios.get(url + 'getRecordList',  {params: {params:data}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}
