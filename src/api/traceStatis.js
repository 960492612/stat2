import axios from 'axios'
import { apiBaseUrl } from '@/config'
let url = apiBaseUrl + 'traceStatis/'

export function getAllVisits(params) {
    return axios.get(url + 'getAllVisits', { params:  params  }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getVisitInfo(params) {
    return axios.get(url + 'getVisitInfo', { params:  params  }).then((res) => {
        return Promise.resolve(res.data)
    })
}
