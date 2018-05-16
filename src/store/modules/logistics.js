const state = {
    begin: null,
    end: null
}

const getters = {
    begin: state=>state.begin,
    end: state=>state.end
}

const actions = {

}

const mutations = {
    setBegin(state, date){
        state.begin = date
    },
    setEnd(state, date){
        state.end = date
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }