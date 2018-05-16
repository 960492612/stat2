import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'logistics/'
export function addSalesByOrder(data) {
    return axios.post(url + 'addSalesByOrder', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addSalesByProduct(data) {
    return axios.post(url + 'addSalesByProduct', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
// date int 
export function getAccountLogisticsFee(beginDate, endDate) {
    return axios.get(url + 'getAccountLogisticsFee', {params:{beginDate, endDate}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getOneLogisticsFee(params) {
    return axios.get(url + 'getAccountLogisticsFee', {params} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getCountryLogisticsFee(beginDate, endDate) {
    return axios.get(url + 'getCountryLogisticsFee', {params:{beginDate, endDate}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getDeliverByPlatform(beginDate, endDate) {
    return axios.get(url + 'getDeliverByPlatform', {params:{beginDate, endDate}} ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getCountOrderByDate(beginDate, endDate) {
    return axios.get(url + 'getCountOrderByDate').then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getCountProductByDate(beginDate, endDate) {
    return axios.get(url + 'getCountProductByDate').then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSKURanking(beginDate, endDate) {
    return axios.get(url + 'getSKURanking', {params:{beginDate, endDate}}).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteLogisticOrder(data) {
    return axios.post(url + 'deleteLogisticOrder', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteLogisticProduct(data) {
    return axios.post(url + 'deleteLogisticProduct', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}