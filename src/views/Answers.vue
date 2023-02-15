<template>
  <PageComponent title="Answers">
    <p v-if="loading" class="flex justify-center">Loading ...</p>
    <div v-else-if="Object.keys(surveys).length" class="relative">
      <div class="grid grid-cols-1 h-full md:grid-cols-3">
        <div class="col-span-1 h-full">
          <ul>
            <li
              v-for="survey in surveys"
              :key="survey.id"
              @click="selectSurvey(survey.id)"
              class="flex gap-2 justify-start items-center p-4 mb-4 shadow-md bg-white cursor-pointer transition-all"
              :class="[selectedSurvey.id === survey.id ? 'bg-gray-100' : '']"
            >
              <div class="flex-1">
                <p class="text-xl font-medium">{{ survey.title }}</p>
                <p class="text-indigo-500">
                  {{ survey.status ? "Active" : "Ended" }}
                </p>
                <span class="text-xs">{{ survey.posted }}</span>
              </div>
              <ChevronRightIcon class="w-7 h-7 text-gray-500" />
            </li>
          </ul>
          <div class="flex justify-center mt-5">
            <nav
              class="relative z-0 inline-flex justify-center rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                v-for="(link, index) of links"
                :key="index"
                :disabled="!link.url"
                v-html="link.label"
                @click="getForPage(link)"
                aria-current="page"
                class="btn !text-gray-900 whitespace-nowrap"
                :class="[
                  link.active
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray:50',
                  index === 0 ? 'rounded-l-md' : '',
                  index === links.length - 1 ? 'rounded-r-md' : '',
                  !link.url ? '!cursor-not-allowed' : '',
                ]"
              ></button>
            </nav>
          </div>
        </div>
        <div class="col-span-2 ml-4">
          <div
            :class="[
              Object.keys(selectedSurvey).length ? 'absolute inset-0' : '',
            ]"
            class="md:relative"
          >
            <div
              :class="[
                Object.keys(selectedSurvey).length ? 'block' : 'hidden ',
              ]"
            >
              <p v-if="!Object.keys(selectedSurvey).length">
                Select one survey to see the data ...
              </p>
              <div
                v-else
                class="p-4 shadow-md rounded-b-sm bg-white animate-fade-in-down"
                style="animation-delay: 0.2s"
              >
                <button
                  class="btn btn-green mb-2 block md:hidden"
                  @click="closeSurvey"
                >
                  Close
                </button>
                <div class="img-container h-[240px] pt-[240px] mb-4">
                  <img
                    :src="selectedSurvey.image"
                    :alt="selectedSurvey.title"
                  />
                </div>
                <h2 class="text-4xl font-bold mb-3">
                  {{ selectedSurvey.title }}
                </h2>
                <p class="text-sm font-medium mb-2 text-emerald-500">
                  {{ selectedSurvey.status ? "Active" : "Finished" }} -
                  {{ selectedSurvey.questions.length }} Questions
                </p>
                <ul>
                  <li class="flex items-center mb-2">
                    <ClockIcon class="btn-icon text-red-400" />
                    <span class="text-xs text-red-500">
                      {{ selectedSurvey.expire_date }}
                    </span>
                  </li>
                </ul>
                <p v-html="selectedSurvey.description" class="mb-4"></p>
                <div class="flex gap-2 mb-5">
                  <a
                    :href="`/view/survey/${selectedSurvey.slug}`"
                    target="_blank"
                    class="btn btn-green"
                  >
                    <EyeIcon class="btn-icon" />
                    See Survey
                  </a>
                  <router-link
                    :to="{
                      name: 'survey-view',
                      params: { id: selectedSurvey.id },
                    }"
                    class="btn btn-plain"
                  >
                    Show More Details
                  </router-link>
                </div>
                <div class="flex flex-col order-2 text-center lg:order-4">
                  <h3 class="text-2xl font-semibold">Total Answers</h3>
                  <div
                    class="flex flex-1 items-center justify-center text-8xl font-semibold"
                  >
                    {{ total }}
                  </div>
                  <router-link
                    :to="{
                      name: 'survey-answers',
                      params: { id: selectedSurvey.id },
                    }"
                    class="btn btn-indigo"
                  >
                    <FolderIcon class="btn-icon" />
                    See Answers
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="max-w-[200px]">
      <router-link to="/surveys/create" class="btn btn-green">
        Try add new survey here
      </router-link>
    </p>
  </PageComponent>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import {
  ClockIcon,
  EyeIcon,
  ChevronRightIcon,
  FolderIcon,
} from "@heroicons/vue/24/outline/index.js";

import PageComponent from "../components/PageComponent.vue";

const store = useStore();

const surveys = computed(() => store.state.surveys.data);
const loading = computed(() => store.state.surveys.loading);
const links = computed(() => store.state.surveys.links);
const total = computed(() => store.state.answers.total);
const selectedSurvey = ref({});

const limit = 4;

onMounted(async () => {
  await store.dispatch("getSurveys", { url: `/survey?limit=${limit}` });
});

async function getForPage(link) {
  if (!link.url || link.active) {
    return;
  }
  await store.dispatch("getSurveys", { url: `${link.url}&limit=${limit}` });
  selectedSurvey.value = {};
}

async function selectSurvey(id) {
  let { data } = await store.dispatch("getSurvey", id);
  selectedSurvey.value = data.data;
  await store.dispatch("getAnswers", { id });
}
function closeSurvey() {
  selectedSurvey.value = {};
}
</script>
