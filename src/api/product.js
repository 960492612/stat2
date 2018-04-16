import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'product/'
export function getProducts() {
    return axios.get(url + 'getProducts').then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getProductCates() {
    return axios.get(url + 'getProductCates').then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addProduct(data) {
    return axios.post(url + 'addProduct', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function editProduct(data) {
    return axios.post(url + 'editProduct', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function hasProductKey(data) {
    return axios.get(url + 'hasProductKey', {params:{data}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteProduct(data) {
    return axios.post(url + 'deleteProduct', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

