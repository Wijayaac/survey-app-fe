<template>
  <PageComponent title="Dashboard">
    <div v-if="loading" class="flex justify-center">Loading ...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="flex flex-col order-1 shadow-md p-3 bg-white text-center animate-fade-in-down lg:order-2"
           style="animation-delay: 0.1s">
        <h3 class="text-2xl font-semibold">
          Total Surveys
        </h3>
        <div class="flex flex-1 items-center justify-center text-8xl font-semibold ">
          {{ data.totalSurveys }}
        </div>
      </div>
      <div class="flex flex-col order-2 shadow-md p-3 bg-white text-center animate-fade-in-down lg:order-4"
           style="animation-delay: 0.2s">
        <h3 class="text-2xl font-semibold">
          Total Answers
        </h3>
        <div class="flex flex-1 items-center justify-center text-8xl font-semibold ">
          {{ data.totalAnswers }}
        </div>
      </div>
      <div class="row-span-2 order-3 shadow-md p-4 bg-white animate-fade-in-down lg:order-1"
      >
        <h3 class="text-2xl font-semibold">
          Latest Survey
        </h3>
        <img :src="data.latestSurvey.image" :alt="data.latestSurvey.title" class="w-[240px] mx-auto">
        <h3 class="font-bold text-xl mb-3">{{ data.latestSurvey.title }}</h3>
        <div class="flex justify-between text-sm mb-1">
          <p>Posted Date:</p>
          <p>{{ data.latestSurvey.created_at }}</p>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <p>Expire Date:</p>
          <p>{{ data.latestSurvey.expire_date }}</p>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <p>Status:</p>
          <p>{{ data.latestSurvey.tatus ? 'Active' : 'Non-active' }}</p>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <p>Questions :</p>
          <p>{{ data.latestSurvey.questions }}</p>
        </div>
        <div class="flex justify-between text-sm mb-3">
          <p>Answers :</p>
          <p>{{ data.latestSurvey.answers }}</p>
        </div>
        <div class="flex justify-between">
          <router-link :to="{name: 'SurveyView', params: { id : data.latestSurvey.id}}"
                       class="flex py-2 px-4 border border-transparent rounded-md text-sm text-indigo-500 hover:bg-indigo-700 hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-4 h-4 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
            </svg>

            Edit Survey
          </router-link>
          <button
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-4 h-4 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>

            Delete Survey
          </button>
        </div>
      </div>
      <div class="row-span-2 order-4 shadow-md p-3 bg-white animate-fade-in-down lg:order-3"
           style="animation-delay: 0.3s">
        <div class="flex justify-between items-center mb-3 px-2">
          <h3 class="text-2xl font-semibold">
            Latest Answers
          </h3>
          <a href="javascript:void(0)" class="text-sm text-blue-500 hover:decoration-blue-500">
            View all
          </a>
        </div>
        <a href="javascript:void(0)" v-for="answer of data.latestAnswers" :key="answer.id"
           class="block p-2 hover:bg-gray-100/90">
          <p class="font-semibold">{{ answer.survey.title }}</p>
          <span class="text-xs">
            Answer made at: <span class="italic font-semibold">{{ answer.end_date }}</span>
          </span>
        </a>
      </div>
    </div>
  </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore()

const loading = computed(() => store.state.dashboard.loading);
const data = computed(() => store.state.dashboard.data)

store.dispatch('getDashboardData')

</script>
