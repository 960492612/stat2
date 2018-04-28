
import * as types from './mutation-type'
import cookie from 'js-cookie'
import storage from 'good-storage'
import { isLogin } from "api/login";
import Index from "@/components/Index";
// import { getProducts } from "api/product";
// 字符串常量
const USERINFO = 'userInfo'
const ROUTER = 'router'

// 登录消息的保存
export const setLogin = ({ commit }, data) => {
    // 一个星期
    let time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7)
    let login = {
        userInfo: { token: data.token, id: data.id, name: data.name, role: data.role, department: data.department, platform: data.platform },
        router: data.routes
    }
    cookie.set(USERINFO, login.userInfo, { expires: time })
    storage.set(ROUTER, login.router)

    commit(types.SET_LOGIN, login)
    commit(types.SET_ISLOGIN, true)
}

export const checkLogin = ({ commit }) => {
    if (!cookie.getJSON('userInfo')) {
        return false
    }
    return isLogin(cookie.getJSON('userInfo').token).then(res => {
        commit(types.SET_ISLOGIN, (res.code == 1))
        return res.code == 1
    }).catch(() => {
        return false
    })
}

export const setLogout = ({ commit }) => {
    cookie.remove(USERINFO)
    storage.remove(ROUTER)
    window.location.reload()
    commit(types.SET_LOGOUT)
    commit(types.SET_ISLOGIN, false)
}

export const changeLanguage = ({ commit }, language) => {
    storage.set('language', language)
    commit(types.SET_LANGUAGE, language)
}

// export const setSelectedAdmin({commit})