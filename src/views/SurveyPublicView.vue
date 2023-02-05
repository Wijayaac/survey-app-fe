<template>
	<div class="py-5">
		<div v-if="loading" class="flex justify-center">
			Loading ...
		</div>
		<form v-else @submit.prevent="submitSurvey" class="container mx-auto bg-white shadow-md p-8 rounded-md">
			<div class="mb-4 pt-[300px] img-container">
				<img :src="survey.image" :alt="survey.title">
			</div>
			<div class="mb-4">
				<h1 class="text-5xl mb-5">{{ survey.title }}</h1>
				<p v-html="survey.description" class="text-gray-500 text-sm"></p>
			</div>
			<div v-if="surveyFinished" class="py-8 px-6 bg-emerald-400 text-white w-[600px] mx-auto">
				<p class="text-xl mb-3 font-semibold">
					Thank you for participating in this survey </p>
				<button @click="submitAnotherResponse" type="button"
								class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Submit another response
				</button>
			</div>
			<p v-else-if="isExpire" class="text-green-500">
				Survey has been ended from - {{ survey.expire_date }} </p>
			<div v-else>
				<hr class="my-4">
				<div v-for="(question,index) of survey.questions" :key="question.id">
					<QuestionViewer v-model="answers[question.id]" :question="question" :index="index"/>
				</div>
				<button type="submit" class="btn btn-indigo">
					Submit
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";

import QuestionViewer from "../components/QuestionViewer.vue";

const route = useRoute()
const store = useStore()

const loading = computed(() => store.state.currentSurvey.loading)
const survey = computed(() => store.state.currentSurvey.data)

const surveyFinished = ref(false)
const isExpire = ref(false)
const answers = ref({})

onMounted(async () => {
	await store.dispatch('getSurveyBySlug', route.params.slug)
	isExpire.value = checkIsExpire(survey.value.expire_date)
})

function submitSurvey() {
	console.log(JSON.stringify(answers.value, undefined, 2))
	store.dispatch('saveSurveyAnswer', {
		surveyId: survey.value.id,
		answers: answers.value
	}).then((response) => {
		if (response.status === 201) {
			surveyFinished.value = true
		}
	})
}

function submitAnotherResponse() {
	answers.value = {};
	surveyFinished.value = false
}

function checkIsExpire(date) {
	console.log(date)
	const expireDate = new Date(date).getTime();
	const currentDate = new Date().getTime()
	console.log(expireDate < currentDate)

	return expireDate < currentDate;
}

</script>
