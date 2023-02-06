<template>
	<PageComponent>
		<template v-slot:header>
			<div class="flex justify-between items-center">
				<h1 class="text-3xl font-bold text-gray-900">Surveys</h1>
				<router-link :to="{name: 'SurveyCreate'}" class="btn btn-green">
					<PlusCircleIcon class="btn-icon"/>
					Add new Survey
				</router-link>
			</div>
		</template>
		<div v-if="surveys.loading" class="flex justify-center">Loading ...</div>
		<div v-else-if="Object.keys(surveys.data).length">
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
				<SurveyListItem v-for="(survey,index) in surveys.data" :key="survey.id" :survey="survey"
												@delete="deleteSurvey(survey)" class="opacity-0 animate-fade-in-down"
												:style="{animationDelay: `${index * 0.1}s`}"/>
			</div>
			<div class="flex justify-center mt-5" v-if="Object.keys(surveys.data).length">
				<nav class="relative z-0 inline-flex justify-center rounded-md shadow-sm" aria-label="Pagination">
					<button v-for="(link,index) of surveys.links" :key="index" :disabled="!link.url" v-html="link.label"
									@click="getForPage(link)"
									class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap"
									:class="[link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':'bg-white border-gray-300 text-gray-500 hover:bg-gray:50', index === 0 ? 'rounded-l-md' : '', index === surveys.links.length - 1 ? 'rounded-r-md' : '']"></button>
				</nav>
			</div>
		</div>
		<p v-else class="max-w-[200px]">
			<router-link to="/surveys/create" class="btn btn-green">
				Add your first survey!
			</router-link>
		</p>
	</PageComponent>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {PlusCircleIcon} from "@heroicons/vue/24/outline/index.js";

import PageComponent from "../components/PageComponent.vue";
import store from "../store/index.js";
import SurveyListItem from "../components/SurveyListItem.vue";

const surveys = computed(() => store.state.surveys)

onMounted(async () => {
	await store.dispatch('getSurveys')
})

async function deleteSurvey(survey) {
	if (confirm('Are you sure want to delete this survey ? Operation cannot be undone')) {
		await store.dispatch('deleteSurvey', survey.id)
		await store.dispatch('getSurveys')
	}
}

async function getForPage(link) {
	if (!link.url || link.active) {
		return
	}
	await store.dispatch('getSurveys', {url: link.url})
}
</script>

