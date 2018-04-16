import axios from 'axios'
import { apiBaseUrl } from '@/config'
let url = apiBaseUrl + 'trace/'

export function deleteTraceGroup(id) {
    return axios.post(url + 'deleteTraceGroup', { id }).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function deleteTraceItem(id) {
    return axios.post(url + 'deleteTraceItem', { id }).then((res) => {
        return Promise.resolve(res.data)
    })
}


// 上传主题组
export function addTraceGroup(data) {
    return axios.post(url + 'addTraceGroup', data).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function editTraceGroup(data) {
    return axios.post(url + 'editTraceGroup', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function editTraceItem(data) {
    return axios.post(url + 'editTraceItem', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getTraceGroup(data) {
    return axios.get(url + 'getTraceGroup', { params: { data } }).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getTraceItem(data) {
    return axios.get(url + 'getTraceItem', { params: { data } }).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addTraceItem(data) {
    return axios.post(url + 'addTraceItem', data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}