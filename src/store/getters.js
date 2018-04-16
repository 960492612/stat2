import {roles} from 'common/js/config';
export const isLogin = state => state.isLogin
export const id = state => state.userInfo && state.userInfo.id
export const loginName = state => state.userInfo && state.userInfo.name
export const role = state => state.userInfo && state.userInfo.role
// export const mid = state => state.userInfo && state.userInfo.mid
export const department = state => state.userInfo && state.userInfo.department 
export const platform = state => state.userInfo && state.userInfo.platform 

export const router = state => state.router

export const selectedAdmin = state => state.selectedAdmin

export const currentLocation = state => state.currentLocation

export const language = state => state.language

export const changeAdmin = state => state.changeAdmin

export const changeProduct = state => state.changeProduct

export const changeTopChannels = state => state.changeTopChannels

export const changeSubChannels = state => state.changeSubChannels

export const changeDate = state => state.changeDate

// export const baseDate = state => state.baseDate

export const isManager = state => {
    return state.userInfo && state.userInfo.role && state.userInfo.role == roles['最高管理员']   
};