import {createRouter, createWebHistory} from "vue-router";

import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Register from "../views/Register.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import Surveys from "../views/Surveys.vue";
import store from "../store/index.js";
import AuthLayout from "../components/AuthLayout.vue";
import SurveyView from "../views/SurveyView.vue";
import SurveyPublicView from "../views/SurveyPublicView.vue";
import Answers from "../views/Answers.vue";
import SurveyAnswers from "../views/SurveyAnswers.vue";
import AnswerView from "../views/AnswerView.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        name: 'Authorization',
        component: DefaultLayout,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: '/surveys',
                name: 'Surveys',
                component: Surveys
            },
            {
                path: '/surveys/create',
                name: 'SurveyCreate',
                component: SurveyView
            },
            {
                path: '/surveys/:id',
                name: 'SurveyView',
                component: SurveyView
            },
            {
                path: '/surveys/:id/answers',
                name: 'SurveyAnswers',
                component: SurveyAnswers
            },
            {
                path: '/answers',
                name: 'Answers',
                component: Answers
            },
            {
                path: '/survey/:slug/answers/:id',
                name: 'AnswerDetail',
                component: AnswerView
            },
        ]
    },
    {
        name: 'Public',
        path: '/view/survey/:slug',
        component: SurveyPublicView
    },
    {
        path: '/auth',
        redirect: '/login',
        name: 'Auth',
        component: AuthLayout,
        meta: {
            isGuest: true
        },
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login
            },
            {
                path: '/register',
                name: 'Register',
                component: Register
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.user.token) {
        next({name: 'Auth'})
    } else if (store.state.user.token && to.meta.isGuest) {
        next({name: 'Dashboard'})
    } else {
        next()
    }
})

export default router
