import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'store/'
export function getStores() {
    return axios.get(url + 'getStores').then((res) => {
        return Promise.resolve(res.data)
    })
}
export function findStores(data) {
    return axios.get(url + 'findStores', {params:{data}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addStore(data) {
    return axios.post(url + 'addStore', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editStore(data) {
    return axios.post(url + 'editStore', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteStore(data) {
    return axios.post(url + 'deleteStore', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
// 查询销售平台
export function getPlatforms() {
    return axios.get(url + 'getPlatforms').then((res) => {
        return Promise.resolve(res.data)
    })
}

export function hasStoreKey(name) {
    return axios.get(url + 'hasStoreKey' ,{params:{name}}).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function addPlatform(data) {
    return axios.post(url + 'addPlatform', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editPlatform(data) {
    return axios.post(url + 'editPlatform', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deletePlatform(data) {
    return axios.post(url + 'deletePlatform', data).then((res) => {
        return Promise.resolve(res.data)
    })
}