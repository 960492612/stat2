import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'channel/'
export function getChannelsByOwner(owner) {
    return axios.get(url + 'getChannelsByOwner', {params:{owner}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getTopChannelsByOwner(owner, pid) {
    return axios.get(url + 'getTopChannelsByOwner', {params:{owner, pid}}).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSubChannelsByOwnerAndId(owner, ids) {
    return axios.get(url + 'getSubChannelsByOwnerAndId', {params:{owner, ids}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addChannels(data) {
    return axios.post(url + 'addChannels', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function editChannels(data) {
    return axios.post(url + 'editChannels', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function deleteChannel(data) {
    return axios.post(url + 'deleteChannel', data ).then((res) => {
        return Promise.resolve(res.data)
    })
}