<template>
	<PageComponent>
		<template v-slot:header>
			<div class="flex items-center justify-between">
				<h1 class="text-3xl font-bold text-gray-900">
					{{ route.params.id ? model.title : "Create a survey" }} </h1>
				<button v-if="route.params.id" @click="deleteSurvey" class="btn btn-red">
					<TrashIcon class="btn-icon"/>
					Delete Survey
				</button>
			</div>
		</template>
		<Alert v-if="Object.keys(errors).length">
			<div class="flex-col">
				<ul v-for="(field, index) of Object.keys(errors)" :key="index">
					<li v-for="(error, idx) of errors[field] || []" :key="idx">
						* {{ error }}
					</li>
				</ul>
			</div>
			<span @click="errors = {}" class="w-8 h-8 btn !p-0 hover:bg-[rgba(0,0,0,0.2)]">
       <XMarkIcon class="btn-icon !mr-0"/>
      </span>
		</Alert>
		<div v-if="surveyLoading" class="flex justify-center">Loading ...</div>
		<form v-else @submit.prevent="saveSurvey" class="animate-fade-in-down">
			<div class="shadow sm:rounded-md sm:overflow-hidden">
				<div class="px-4 py-5 bg-white space-y-6 sm:p-6">
					<!-- image-->
					<div>
						<label for="image" class="block text-sm font-medium text-gray-700">Image</label>
						<div class="mt-1 flex items-center">
							<div v-if="model.imageUrl || model.image" class="img-container w-64 pt-64">
								<img :src="model.imageUrl ? model.imageUrl : model.image" :alt="model.title"/>
							</div>
							<span v-else class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
								<PhotoIcon class="h-[80%] w-[80%] text-gray-300"/>
              </span>
							<button type="button" class="btn btn-white overflow-hidden ml-5">
								<input @change="onImageChoose" type="file" class="absolute inset-0 opacity-0 cursor-pointer"/>
								Change
							</button>
						</div>
					</div>
					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
						<input type="text" name="title" id="title" v-model="model.title" autocomplete="survey-title"
									 class="mt-1 form-input"/>
					</div>
					<!--  Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
						<textarea name="description" id="title" v-model="model.description" autocomplete="survey-description"
											rows="4" class="mt-2 form-input">
            </textarea>
					</div>
					<!-- Expire Date -->
					<div>
						<label for="expire-date" class="block text-sm font-medium text-gray-700">Expire</label>
						<input type="date" name="expire-date" id="expire-date" v-model="model.expire_date" class="mt-1 form-input"/>
					</div>
					<!--  Status-->
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input id="status" name="status" type="checkbox" v-model="model.status" class="form-check"/>
						</div>
						<div class="ml-3 text-sm">
							<label for="status" class="font-medium text-gray-700">Active</label>
						</div>
					</div>
				</div>
				<!-- End of wrapper field-->
				<div class="px-4 py-5 bg-white space-y-6 sm:p-6">
					<h3 class="text-2xl font-semibold flex items-center justify-between">
						Questions </h3>
					<div v-if="!model.questions?.length" class="text-center text-gray-600 ">
						You do not have any questions created
					</div>
					<div v-for="(question, index) in model.questions" :key="question.id">
						<QuestionEditor :question="question" :index="index" @change="questionChange"
														@deleteQuestion="deleteQuestion"/>
					</div>
					<div>
						<button type="button" @click="addQuestion" class="btn btn-grey mx-auto ">
							<PlusCircleIcon class="btn-icon"/>
							Add Question
						</button>
					</div>
				</div>
				<div class="px-4 py-3 bg-gray-50 sm:px-6">
					<button type="submit" class="btn btn-indigo ml-auto">
						Save
					</button>
				</div>

			</div>
		</form>
	</PageComponent>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {v4 as uuidv4} from 'uuid'
import {TrashIcon, PhotoIcon, PlusCircleIcon, XMarkIcon} from "@heroicons/vue/24/outline/index.js";

import store from "../store/index.js";
import PageComponent from "../components/PageComponent.vue";
import QuestionEditor from "../components/QuestionEditor.vue";
import Alert from "../components/Alert.vue";

const route = useRoute()
const router = useRouter()
const surveyLoading = computed(() => store.state.currentSurvey.loading)

let model = ref({
	title: null,
	status: false,
	description: null,
	image: null,
	expire_date: null,
	questions: []
})

const errors = ref({})

// Watch to current survey data change and when this happens we update local data
watch(() => store.state.currentSurvey.data,
		(newValue) => {
			model.value = {
				...JSON.parse(JSON.stringify(newValue)),
				status: newValue.status !== 'draft'
			}
		})

onMounted(async () => {
	if (route.params.id) {
		await store.dispatch('getSurvey', route.params.id)
	}
})

function onImageChoose(e) {
	const file = e.target.files[0];
	const reader = new FileReader()
	reader.onload = () => {
		model.value.image = reader.result;
		model.value.imageUrl = reader.result;
	}
	reader.readAsDataURL(file)
}

function addQuestion() {
	const newQuestion = {
		id: uuidv4(),
		type: null,
		question: null,
		description: null,
		data: {}
	}

	model.value.questions.push(newQuestion)
}

function deleteQuestion(question) {
	model.value.questions = model.value.questions.filter((item) => item !== question)
}

function questionChange(question) {
	model.value.questions = model.value.questions.map((item) => {
		if (item.id === question.id) {
			return JSON.parse(JSON.stringify(question))
		}
		return item
	})
}

function saveSurvey() {
	store.dispatch('saveSurvey', model.value).then(() => {
		store.commit('notify', {
			type: 'success',
			message: 'Survey was successfully updated',
		})
		router.push({
			name: "Surveys",
		})
	}).catch(error => {
		if (error.response.status === 422) {
			errors.value = error.response.data.errors
		}
	})
}

async function deleteSurvey() {
	if (confirm('Are you sure want to delete this survey ? This operation cannot be undone')) {

		await store.dispatch('deleteSurvey', model.value.id)
		await router.push({
			name: 'Surveys'
		})
	}
}
</script>
