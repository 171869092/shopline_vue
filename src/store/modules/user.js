import { login, register, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getCookies, setCookies, removeAllCookies } from '@/utils/cookies'

const getDefaultState = () => {
  return {
    token: getToken(),
    uid: getCookies('uid'),
    name: '',
    email: getCookies('email'),
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        commit('SET_EMAIL', data.email)
        commit('SET_AVATAR', data.icon)
        commit('SET_UID', data.u)
        setToken(data.token)
        setCookies('uid', data.u)
        setCookies('email', data.email)
        setCookies('name', data.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user register
  register({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      register(userInfo).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_NAME', data.username)
          commit('SET_EMAIL', data.email)
          commit('SET_UID', data.u)
          setToken(data.token)
          setCookies('uid', data.u)
          setCookies('email', data.email)
          setCookies('name', data.username)
          resolve(data)
        } else {
          reject([])
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name } = data
        let avatar = data.icon

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        removeAllCookies()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeAllCookies()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
