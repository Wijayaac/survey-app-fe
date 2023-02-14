<template>
  <PageComponent title="Dashboard">
    <div v-if="loading" class="flex justify-center">Loading ...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-if="Object.keys(data).length"
        class="flex flex-col order-1 shadow-md p-3 bg-white text-center animate-fade-in-down lg:order-2"
        style="animation-delay: 0.1s"
      >
        <h3 class="text-2xl font-semibold">Total Surveys</h3>
        <div
          class="flex flex-1 items-center justify-center text-8xl font-semibold"
        >
          {{ data.totalSurveys }}
        </div>
      </div>
      <div
        v-if="Object.keys(data).length"
        class="flex flex-col order-2 shadow-md p-3 bg-white text-center animate-fade-in-down lg:order-4"
        style="animation-delay: 0.2s"
      >
        <h3 class="text-2xl font-semibold">Total Answers</h3>
        <div
          class="flex flex-1 items-center justify-center text-8xl font-semibold"
        >
          {{ data.totalAnswers }}
        </div>
      </div>
      <div
        v-if="Object.keys(data).length"
        class="row-span-2 order-3 shadow-md p-4 bg-white animate-fade-in-down lg:order-1"
      >
        <h3 class="text-2xl font-semibold">Latest Survey</h3>
        <div v-if="data.latestSurvey">
          <div class="img-container pt-[240px] w-64">
            <img
              :src="data.latestSurvey.image"
              :alt="data.latestSurvey.title"
              class="mx-auto"
            />
          </div>
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
            <p>{{ data.latestSurvey.tatus ? "Active" : "Non-active" }}</p>
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
            <router-link
              :to="{
                name: 'survey-view',
                params: { id: data.latestSurvey.id },
              }"
              class="btn btn-plain"
            >
              <PencilIcon class="btn-icon" />
              Edit Survey
            </router-link>
            <a
              :href="`/view/survey/${data.latestSurvey.slug}`"
              target="_blank"
              class="btn btn-green"
            >
              <EyeIcon class="btn-icon" />
              View Survey
            </a>
          </div>
        </div>
      </div>
      <div
        v-if="Object.keys(data).length"
        class="row-span-2 order-4 shadow-md p-3 bg-white animate-fade-in-down lg:order-3"
        style="animation-delay: 0.3s"
      >
        <div class="flex justify-between items-center mb-3 px-2">
          <h3 class="text-2xl font-semibold">Latest Answers</h3>
          <a
            href="javascript:void(0)"
            class="text-sm text-blue-500 hover:decoration-blue-500"
          >
            View all
          </a>
        </div>
        <router-link
          :to="`/surveys/${answer.survey.id}`"
          v-for="answer of data.latestAnswers"
          :key="answer.id"
          class="block p-2 hover:bg-gray-100/90"
        >
          <p class="font-semibold">{{ answer.survey.title }}</p>
          <span class="text-xs">
            Answer made at:
            <span class="italic font-semibold">{{ answer.end_date }}</span>
          </span>
        </router-link>
      </div>
    </div>
  </PageComponent>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { PencilIcon, EyeIcon } from "@heroicons/vue/24/outline/index.js";

import PageComponent from "../components/PageComponent.vue";

const store = useStore();

const loading = computed(() => store.state.dashboard.loading);
const data = computed(() => store.state.dashboard.data);

onMounted(async () => {
  await store.dispatch("getDashboardData");
});
</script>
