import cookie from 'js-cookie'
import storage from 'good-storage'

const state = {
    userInfo: cookie.getJSON('userInfo'),
    isLogin: false,
    router: storage.get('router', []),
    // selectedAdmin: null,
    currentLocation: storage.session.get('currentLocation', ''),

    language: storage.get('language', 'zh-cn'),
    // ç­›é€‰
    changeAdmin: null,
    changeProduct: null,
    changeTopChannels: null,
    changeSubChannels: null,
    changeDate: null,
    baseDate: storage.get('baseDate', '2017-12-10')
}
export default state