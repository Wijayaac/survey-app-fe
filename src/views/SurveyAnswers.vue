<template>
	<PageComponent title="Survey Answers">
		<p v-if="loading">loading ...</p>
		<div v-else class="p-8 bg-white shadow-md rounded-md">
			<div class="img-container mr-4 mb-4 h-[300px]">
				<img :src="survey.image" :alt="survey.title">
			</div>
			<h2 class="text-4xl font-bold mb-3">{{ survey.title }}</h2>
			<p class="text-emerald-500 text-sm mb-2">{{ survey.status ? 'Active' : 'Finished' }}</p>
			<ul class="mb-4">
				<li class="flex items-center mb-2">
					<QuestionMarkCircleIcon class="btn-icon text-gray-900 text-indigo-500"/>
					<span class="text-sm text-indigo-500">
						{{ survey.questions.length }} Questions
					</span>
				</li>
				<li class="flex items-center mb-2">
					<ClockIcon class="btn-icon text-gray-900 text-red-500"/>
					<span class="text-sm text-red-500">
						{{ survey.expire_date }} Expire Date
					</span>
				</li>
			</ul>
			<p v-html="survey.description" class="mb-4 text-gray-700"></p>
			<div class="flex gap-2 mb-4">
				<a :href="`/view/survey/${survey.slug}`" target="_blank" class="btn btn-green">
					<EyeIcon class="btn-icon"/>
					See Survey
				</a>
				<router-link :to="{name: 'SurveyView', params: {id: route.params.id}}" class="btn btn-grey">
					<PencilIcon class="btn-icon"/>
					Edit Survey
				</router-link>
				<button class="btn-indigo" @click="exportData">
					<DocumentChartBarIcon class="btn-icon"/>
					Export Data
				</button>
			</div>

			<div class="relative rounded-xl overflow-auto">
				<div class="shadow-sm overflow-hidden my-8">
					<table class="border-collapse table-fixed w-full text-sm">
						<thead>
						<tr>
							<th class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
								Id
							</th>
							<th class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
								Submitted At
							</th>
							<th class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
								Survey Expire
							</th>
							<th class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
								See details
							</th>
						</tr>
						</thead>
						<tbody class="bg-white dark:bg-slate-800">
						<tr v-for="answer in answers" :key="answers.id">
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-gray-700 dark:text-gray-700">
								{{ answer.id }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 text-gray-700 dark:text-gray-700">
								{{ answer.created_at }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-gray-700 dark:text-gray-700">
								{{ answer.expire_date }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-gray-700 dark:text-gray-700">
								<router-link :to="{name: 'AnswerDetail', params: {slug : survey.slug, id: answer.id}}">
									<EyeIcon class="btn-icon transition-colors hover:text-indigo-400"/>
								</router-link>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</PageComponent>
</template>

<script setup>
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import {
	ClockIcon,
	EyeIcon,
	PencilIcon,
	DocumentChartBarIcon,
	QuestionMarkCircleIcon
} from "@heroicons/vue/24/outline/index.js";

import PageComponent from "../components/PageComponent.vue";
import axiosClient from "../axios.js";

const route = useRoute()
const store = useStore()

const survey = computed(() => store.state.currentSurvey.data)
const loading = computed(() => store.state.currentSurvey.loading)
const answers = computed(() => store.state.answers.data)

onMounted(async () => {
	await store.dispatch('getSurvey', route.params.id)
	await store.dispatch('getAnswers', route.params.id)

})

async function exportData() {
	let response = await axiosClient.get(`/export?survey=${route.params.id}`, {responseType: 'blob'})

	let fileURL = window.URL.createObjectURL(new Blob([response.data]));
	let fileLink = document.createElement('a')

	fileLink.href = fileURL
	fileLink.setAttribute('download', 'answers.xlsx')

	document.body.appendChild(fileLink);

	fileLink.click()
}

</script>
