import axios from 'axios'
import { apiBaseUrl } from '@/config'
axios.defaults.withCredentials = true
let url = apiBaseUrl + 'account/'
export function hasUser(data) {
    return axios.get(url + 'hasUser', { params: { data } }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function editUserPassword(data) {
    return axios.post(url + 'editUserPassword', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function editUserName(data) {
    return axios.post(url + 'editUserName', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function addUser(data) {
    return axios.post(url + 'addUser', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
// 按照角色查找管理员
export function getAdmins(role) {
    return axios.get(url + 'getAdmins', {params:{role}}).then((res) => {
        return Promise.resolve(res.data)
    })
}
export function getAllUsers(data) {
    return axios.get(url + 'getAllUsers', {params:{data}}).then((res) => {
        return Promise.resolve(res.data)
    })
}

// export function getPlatforms() {
//     return axios.get(url + 'getPlatforms').then((res) => {
//         return Promise.resolve(res.data)
//     })
// }

export function deleteUser(data) {
    return axios.post(url + 'deleteUser', data).then((res) => {
        return Promise.resolve(res.data)
    })
}
// 获取部门
export function getDepartments() {
    return axios.get(url + 'getDepartments').then((res) => {
        return Promise.resolve(res.data)
    })
}

