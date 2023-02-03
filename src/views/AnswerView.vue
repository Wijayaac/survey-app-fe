<template>
	<PageComponent title="test">
		<div class="py-5 PX-8">
			<div v-if="loading" class="flex justify-center">
				Loading ...
			</div>
			<div v-else class="container mx-auto">
				<div class="grid grid-cols-6 items-center">
					<div class="mr-4">
						<img :src="survey.image" :alt="survey.title">
					</div>
					<div class="col-span-5">
						<h1 class="text-3xl mb-3">{{ survey.title }}</h1>
						<p v-html="survey.description" class="text-gray-500 text-sm"></p>
					</div>
				</div>
				<div>
					<hr class="my-3">
					<div v-for="(question,index) of survey.questions" :key="question.id">
						<QuestionViewer v-model="answers[question.id]" :question="question" :index="index"/>
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
