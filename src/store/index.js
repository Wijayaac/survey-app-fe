import {createStore} from "vuex";
import axiosClient from "../axios.js";

const store = createStore({
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN')
        },
        dashboard: {
            loading: false,
            data: {}
        },
        currentSurvey: {
            loading: false,
            data: {}
        },
        surveys: {
            loading: false,
            links: [],
            data: []
        },
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
        notification: {
            show: false,
            type: null,
            message: null,
        }
    },
    getters: {},
    actions: {
        getDashboardData({commit}) {
            commit('setDashboardLoading', true);
            return axiosClient.get('/dashboard').then((res) => {
                commit('setDashboard', res.data)
                return res
            }).catch(e => {
                throw e
            }).finally(() => {
                commit('setDashboardLoading', false);
            })
        },
        getSurveys({commit}, payload = null) {
            let url = payload?.url || '/survey'
            commit("setSurveysLoading", true)
            return axiosClient.get(url).then((res) => {
                commit("setSurveys", res.data)
                return res;
            }).catch((err) => {
                throw err
            }).finally(() => {
                commit("setSurveysLoading", false)
            })
        },
        getSurvey({commit}, id) {
            commit("setCurrentSurveyLoading", true)
            return axiosClient.get(`/survey/${id}`).then((res) => {
                commit("setCurrentSurvey", res.data)
                return res;
            }).catch((err) => {
                throw err
            }).finally(() => {
                commit("setCurrentSurveyLoading", false)
            })
        },
        getSurveyBySlug({commit}, slug) {
            commit("setCurrentSurveyLoading", true)
            return axiosClient.get(`/survey-by-slug/${slug}`).then((res) => {
                commit("setCurrentSurvey", res.data)
                return res;
            }).catch((err) => {
                throw err
            }).finally(() => {
                commit("setCurrentSurveyLoading", false)
            })
        },
        saveSurvey({commit}, survey) {
            let response;
            delete survey.imageUrl;

            if (survey.id) {
                response = axiosClient.put(`/survey/${survey.id}`, survey).then((res) => {
                    commit("setCurrentSurvey", res.data)
                    return res
                })
            } else {
                response = axiosClient.post('/survey', survey).then((res) => {
                    commit('setCurrentSurvey', res.data);
                    return res
                })
            }
            return response;
        },
        deleteSurvey({}, id) {
            return axiosClient.delete(`/survey/${id}`)
        },
        saveSurveyAnswer({commit}, {surveyId, answers}) {
            return axiosClient.post(`/survey/${surveyId}/answer`, {answers}).then((res) => {
                // commit('setCurrentSurvey', res.data);
                return res
            })
        },
        register({commit}, user) {
            return axiosClient.post('/register', user).then(({data}) => {
                commit('setUser', data)
                return data
            })
        },
        login({commit}, user) {
            return axiosClient.post('/login', user).then(({data}) => {
                commit('setUser', data)
                return data
            })
        },
        logout({commit}) {
            return axiosClient.get('/logout').then((response) => {
                commit('logout')
                return response
            })
        }
    },
    mutations: {
        setDashboardLoading: (state, loading) => {
            state.dashboard.loading = loading
        },
        setDashboard: (state, data) => {
            state.dashboard.data = data
        },
        setSurveysLoading: (state, loading) => {
            state.surveys.loading = loading
        },
        setSurveys: (state, surveys) => {
            state.surveys.links = surveys.meta.links
            state.surveys.data = surveys.data
        },
        setCurrentSurveyLoading: (state, loading) => {
            state.currentSurvey.loading = loading
        },
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data
        },
        logout: (state) => {
            state.user.data = {}
            state.user.token = null
            sessionStorage.removeItem('TOKEN')
        },
        setUser: (state, userData) => {
            state.user.token = userData.token
            state.user.data = userData.user
            sessionStorage.setItem('TOKEN', userData.token)
        },
        notify: (state, {message, type}) => {
            state.notification.show = true;
            state.notification.type = type;
            state.notification.message = message;

            setTimeout(() => {
                state.notification.show = false
            }, 3000)
        }
    },
    modules: {}
});

export default store
