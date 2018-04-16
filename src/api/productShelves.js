import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'productShelves/'

export function upload(data) {
    return axios.post(url + 'upload', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getInfoByWeek(data) {
    return axios.get(url + 'getInfoByWeek', {params:{data}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getAllByWeek(data) {
    return axios.get(url + 'getAllByWeek', {params:{data}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getInfoByMonth(data) {
    return axios.get(url + 'getInfoByMonth', {params:{data}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getAllByMonth(data) {
    return axios.get(url + 'getAllByMonth', {params:{data}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getGroupList(data) {
    return axios.get(url + 'getGroupList', {params:data} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteShelve(data) {
    return axios.post(url + 'deleteShelve', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editShelve(data) {
    return axios.post(url + 'editShelve', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}