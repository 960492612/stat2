import * as types from './mutation-type'
import storage from 'good-storage'
const mutations = {
    [types.SET_LOGIN](state, login) {
        // 直接存储对象
        
        state.router = login.router
        state.userInfo = login.userInfo
    },
    [types.SET_ISLOGIN](state, result) {
        // 查看是否登录正确
        state.isLogin = result
    },
    [types.SET_SELECTED_ADMIN](state, id) {
        state.selectedAdmin = id
        state.selectedPlatform = null
    },
    [types.SET_SELECTED_PLATFORM](state, pf) {
        state.selectedPlatform = pf
        state.selectedAdmin = null
    },
    [types.SET_LOGOUT](state){
        state.userInfo = null
        state.router = []
    },
    [types.SET_CURRENT_LOCATION](state, location){
        state.currentLocation = location
        storage.session.set('currentLocation', location)
    },
    [types.SET_LANGUAGE](state, language){
        state.language = language
    },
    [types.SET_CHANGE_ADMIN](state, admin){
        state.changeAdmin = admin
    },
    [types.SET_CHANGE_PRODUCT](state, product){
        state.changeProduct = product
    },
    [types.SET_CHANGE_DATE](state, date){
        state.changeDate = date
    },
    [types.SET_CHANGE_TOP_CHANNELS](state, channels){
        state.changeTopChannels = channels
    },
    [types.SET_CHANGE_SUB_CHANNELS](state, channels){
        state.changeSubChannels = channels
    },
    // 存字符串
    [types.SET_BASEDATE](state, date){
        state.baseDate = date
        storage.set('baseDate', date)
    }

}
export default mutations