import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'subject/'
export function getSubjectsByAid(aid, page, size) {
    return axios.get(url + 'getSubjectsByAid', {params:{aid, page, size}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getSubjectsTotal(aid) {
    return axios.get(url + 'getSubjectsTotal', {params:{aid}}).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function addSubject(data) {
    return axios.post(url + 'addSubject',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editSubject(data) {
    return axios.post(url + 'editSubject',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function deleteSubject(data) {
    return axios.post(url + 'deleteSubject',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getSubjectsBySid(sid) {
    return axios.get(url + 'getSubjectsBySid',  {params:{sid}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSubjectsByQuery(type, query, id) {
    return axios.get(url + 'getSubjectsByQuery',  {params:{type, query, id}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function toggleSubject(data) {
    return axios.post(url + 'toggleSubject',  data  ).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function searchSubjectOnDays(recordDays, publishDays, id) {
    return axios.get(url + 'searchSubjectOnDays',  {params:{recordDays, publishDays, id}}  ).then((res) => {
        return Promise.resolve(res.data)
    })
}