<template>
	<PageComponent title="Survey Answers">
		<p v-if="loading">loading ...</p>
		<div v-else>
			<div class="mr-4 max-h-[200px] overflow-hidden">
				<img :src="survey.image" :alt="survey.title" class="object-cover object-center">
			</div>
			<h2>{{ survey.title }}</h2>
			<p>{{ survey.status ? 'active' : 'ended' }} - Questions</p>
			<ul>
				<li class="flex">
					<ClockIcon class="btn-icon text-gray-900"/>
					<span>
						{{ survey.expire_date }}
					</span>
				</li>
			</ul>
			<p v-html="survey.description"></p>
			<div class="flex">
				<a :href="`/view/survey/${survey.slug}`" target="_blank" class="btn btn-green mr-2">
					<EyeIcon class="btn-icon"/>
					See Survey
				</a>
				<router-link :to="{name: 'SurveyView', params: {id: route.params.id}}" class="btn btn-plain">
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
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
								{{ answer.id }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
								{{ answer.created_at }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
								{{ answer.expire_date }}
							</td>
							<td class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
								<router-link :to="{name: 'AnswerDetail', params: {slug : survey.slug, id: answer.id}}">
									<EyeIcon class="btn-icon"/>
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
import {ClockIcon, EyeIcon, PencilIcon, DocumentChartBarIcon} from "@heroicons/vue/24/outline/index.js";

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
