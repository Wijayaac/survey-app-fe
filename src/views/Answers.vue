<template>
	<PageComponent title="Answers">
		<p v-if="loading" class="flex justify-center">Loading ...</p>
		<div v-else>
			<div class="grid grid-cols-1 h-full md:grid-cols-3">
				<div class="col-span-1 h-full">
					<ul>
						<li v-for="(survey) in surveys" :key="survey.id" :survey="survey" @click="selectSurvey(survey.id)"
								class="flex gap-2 justify-start cursor-pointer">
							<img :src="survey.image" :alt="survey.title" class="max-w-[100px]">
							<div class="flex-1">
								<p class="text-xl">{{ survey.title }}</p>
								<p>{{ survey.status ? 'Active' : 'Ended' }}</p>
								<span>{{ survey.posted }}</span>
							</div>
						</li>
					</ul>
					<div class="flex justify-center mt-5">
						<nav class="relative z-0 inline-flex justify-center rounded-md shadow-sm" aria-label="Pagination">
							<a v-for="(link,index) of links" :key="index" :disabled="!link.url" v-html="link.label"
								 href="javascript:void(0)" @click="getForPage(link)" aria-current="page"
								 class="btn !text-gray-900 whitespace-nowrap"
								 :class="[link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':'bg-white border-gray-300 text-gray-500 hover:bg-gray:50', index === 0 ? 'rounded-l-md' : '', index === links.length - 1 ? 'rounded-r-md' : '']"></a>
						</nav>
					</div>
				</div>
				<div class="col-span-2 hidden md:block">
					<p v-if="!Object.keys(selectedSurvey).length">Select one survey to see the data ...</p>
					<div v-else>
						<h2>{{ selectedSurvey.title }}</h2>
						<p>{{ selectedSurvey.status ? 'active' : 'ended' }} - {{ selectedSurvey.questions.length }} Questions</p>
						<ul>
							<li class="flex">
								<ClockIcon class="btn-icon text-gray-900"/>
								<span>
									{{ selectedSurvey.expire_date }}
								</span>
							</li>
						</ul>
						<p v-html="selectedSurvey.description"></p>
						<div class="flex">
							<a :href="`/view/survey/${selectedSurvey.slug}`" target="_blank" class="btn btn-green">
								<EyeIcon class="btn-icon"/>
								See Survey
							</a>
							<router-link :to="{name: 'SurveyView', params: {id: selectedSurvey.id}}" class="btn btn-plain">
								Show More Details
							</router-link>
						</div>
						<div class="flex flex-col order-2 shadow-md p-3 bg-white text-center animate-fade-in-down lg:order-4"
								 style="animation-delay: 0.2s">
							<h3 class="text-2xl font-semibold">
								Total Answers </h3>
							<div class="flex flex-1 items-center justify-center text-8xl font-semibold ">
								{{ total }}
							</div>
							<router-link :to="{name: 'SurveyAnswers', params: {id : selectedSurvey.id}}" class="btn btn-indigo">
								See All
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</PageComponent>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import {ClockIcon, EyeIcon} from "@heroicons/vue/24/outline/index.js";

import PageComponent from "../components/PageComponent.vue";

const store = useStore()

const surveys = computed(() => store.state.surveys.data)
const loading = computed(() => store.state.surveys.loading)
const links = computed(() => store.state.surveys.links)
const total = computed(() => store.state.answers.total)
const selectedSurvey = ref({})

const limit = 1

onMounted(async () => {
	await store.dispatch('getSurveys', {url: `/survey?limit=${limit}`})
})

async function getForPage(link) {
	if (!link.url || link.active) {
		return
	}
	await store.dispatch('getSurveys', {url: `${link.url}&limit=${limit}`})
	selectedSurvey.value = {}
}

async function selectSurvey(id) {
	await store.dispatch('getSurvey', id).then((response) => {
		const {data: {data}} = response
		selectedSurvey.value = data
	})

	await store.dispatch('getAnswers', id)
}

</script>
