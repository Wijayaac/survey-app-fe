import { createRouter, createWebHistory } from "vue-router";

const Login = () => import("../views/Login.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const Register = () => import("../views/Register.vue");
const DefaultLayout = () => import("../components/DefaultLayout.vue");
const Surveys = () => import("../views/Surveys.vue");
const AuthLayout = () => import("../components/AuthLayout.vue");
const SurveyView = () => import("../views/SurveyView.vue");
const SurveyPublicView = () => import("../views/SurveyPublicView.vue");
const Answers = () => import("../views/Answers.vue");
const SurveyAnswers = () => import("../views/SurveyAnswers.vue");
const AnswerView = () => import("../views/AnswerView.vue");
const PrintSurvey = () => import("../views/PrintSurvey.vue");

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
