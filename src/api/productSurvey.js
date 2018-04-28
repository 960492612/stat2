import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'productSurvey/'
export function getParams(data) {
    return axios.get(url + 'getParams', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getAllParams() {
    return axios.get(url + 'getAllParams').then((res) => {
        return Promise.resolve(res.data)
    })
}
export function checkProduct(data) {
    return axios.get(url + 'checkProduct', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getSurveys(data) {
    return axios.get(url + 'getSurveys', {params:{data}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getSurveyParamsBySurveyId(data) {
    return axios.get(url + 'getSurveyParamsBySurveyId', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function saveSurvey(data) {
    return axios.post(url + 'saveSurvey', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function editSurvey(data) {
    return axios.post(url + 'editSurvey', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function deleteSurvey(data) {
    return axios.post(url + 'deleteSurvey', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function publish(data) {
    return axios.post(url + 'publish', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function canclePublished(data) {
    return axios.post(url + 'canclePublished', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function copySurvey(data) {
    return axios.post(url + 'copySurvey', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getPublishSurveys(data) {
    return axios.get(url + 'getPublishSurveys', {params:{data}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function saveFeedback(data) {
    return axios.post(url + 'saveFeedback', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getPublishStores(data) {
    return axios.get(url + 'getPublishStores', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function checkParam(data) {
    return axios.get(url + 'checkParam', {params:data}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addParam(data) {
    return axios.post(url + 'addParam', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editParam(data) {
    return axios.post(url + 'editParam', data).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteParam(data) {
    return axios.post(url + 'deleteParam', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
