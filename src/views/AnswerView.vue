<template>
	<PageComponent title="Survey Answer">
		<div class="py-5">
			<div v-if="loading" class="flex justify-center">
				Loading ...
			</div>
			<div v-else class="container mx-auto shadow-md p-8 rounded-md bg-white">
				<div class="mb-5 img-container pt-[300px]">
					<img :src="survey.image" :alt="survey.title">
				</div>
				<div class="mb-4">
					<h1 class="text-5xl mb-4">{{ survey.title }}</h1>
					<p v-html="survey.description" class="text-gray-700 text-sm"></p>
				</div>
				<div>
					<hr class="my-4">
					<div v-for="(question,index) of survey.questions" :key="question.id">
						<QuestionViewer v-model="answers[question.id]" :disabled="true" :question="question" :index="index"/>
					</div>
				</div>
			</div>
		</div>
	</PageComponent>
</template>

<script setup>
import {useRoute} from "vue-router";

import PageComponent from "../components/PageComponent.vue";
import QuestionViewer from "../components/QuestionViewer.vue";
import {useStore} from "vuex";
import {computed, onMounted} from "vue";

const route = useRoute()
const store = useStore()

const survey = computed(() => store.state.currentSurvey.data);
const loading = computed(() => store.state.currentSurvey.loading);
const answers = computed(() => store.state.currentAnswer.data)

onMounted(async () => {
	await store.dispatch('getSurveyBySlug', route.params.slug)
	await store.dispatch('getAnswer', route.params.id)
})
</script>
