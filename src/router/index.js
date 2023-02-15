import { createRouter, createWebHistory } from "vue-router";

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
import PrintSurvey from "../views/PrintSurvey.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "authorization",
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/surveys",
        name: "surveys",
        component: Surveys,
      },
      {
        path: "/surveys/create",
        name: "survey-create",
        component: SurveyView,
      },
      {
        path: "/surveys/:id",
        name: "survey-view",
        component: SurveyView,
      },
      {
        path: "/surveys/:id/answers",
        name: "survey-answers",
        component: SurveyAnswers,
      },
      {
        path: "/answers",
        name: "answers",
        component: Answers,
      },
      {
        path: "/survey/:slug/answers/:id",
        name: "answer-detail",
        component: AnswerView,
      },
      {
        path: "/print/:slug",
        name: "print-survey",
        component: PrintSurvey,
      },
    ],
  },
  {
    name: "public",
    path: "/view/survey/:slug",
    component: SurveyPublicView,
  },
  {
    path: "/auth",
    redirect: "/login",
    name: "auth",
    component: AuthLayout,
    meta: {
      isGuest: true,
    },
    children: [
      {
        path: "/login",
        name: "login",
        component: Login,
      },
      {
        path: "/register",
        name: "register",
        component: Register,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("TOKEN") !== null;
  if (to.meta.requiresAuth && !token) {
    next({ name: "auth" });
  } else if (token && to.meta.isGuest) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
