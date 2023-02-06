<template>
	<div v-if="loading" class="flex justify-center">
		Loading ...
	</div>
	<div v-else class="container mx-auto bg-white shadow-md p-8 rounded-md">
		<section ref="pdf">
			<div class="mb-4">
				<h1 class="header font-bold text-3xl mb-4">{{ survey.title }}</h1>
				<p v-html="survey.description" style="font-size: 18px"></p>
				<hr/>
			</div>
			<!--		Compare -->
			<fieldset v-for="(question,index) of survey.questions" :key="question.id">
				<div>
					<legend class="text-base font-medium text-gray-900">
						{{ index + 1 }}. {{ question.question }}
					</legend>
					<p class="text-gray-500 text-sm">
						{{ question.description }} </p>
				</div>
				<div class="my-3">
					<div v-if="question.type === 'select'">
						<p>Pick only one option </p>
						<ul class="list">
							<li v-for="option in question.data.options" :key="option.uuid" :value="option.text">
								<input :id="option.uuid" :name="`question${question.id}`" type="radio" class="form-check" disabled/>
								<label :for="option.uuid" class="ml-3 text-sm font-medium text-gray-700">
									{{ option.text }}
								</label>
							</li>
						</ul>
					</div>
					<div v-else-if="question.type === 'radio'">
						<p>Pick only one option </p>
						<ul class="list">
							<li v-for="(option) of question.data.options" :key="option.uuid" class="flex items-center">
								<input :id="option.uuid" :name="`question${question.id}`" :value="option.text" type="radio"
											 class="form-check" disabled/>
								<label :for="option.uuid" class="ml-3 block text-sm font-medium text-gray-700">
									{{ option.text }}
								</label>
							</li>
						</ul>
					</div>
					<div v-else-if="question.type === 'checkbox'">
						<p>Pick one option or more</p>
						<ul class="list">
							<li v-for="option of question.data.options" :key="option.uuid" class="flex items-center">
								<input :id="option.uuid" :name="`question${question.id}`" class="form-check" disabled/>
								<label :for="option.uuid" class="ml-3 block text-sm font-medium text-gray-700">
									{{ option.text }}
								</label>
							</li>
						</ul>
					</div>
					<div v-else-if="question.type === 'text'">
						<input type="text" :name="question.id" :id="question.id" class="mt-1 form-input" disabled>
						<hr class="mb-4">
					</div>
					<div v-else-if="question.type === 'textarea'">
        	<textarea :name="question.id" :id="question.id" class="mt-1 form-input" disabled>
        	</textarea>
					</div>
				</div>
				<hr v-if="question.type === 'text' || question.type === 'textarea'" class="spacing"/>
				<hr v-if="question.type === 'textarea'"/>
			</fieldset>
		</section>
	</div>
</template>

<script setup>
import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfMake from 'html-to-pdfmake'
import {useRouter, useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";

const router = useRouter();
const route = useRoute()
const store = useStore()

const survey = computed(() => store.state.currentSurvey.data)
const loading = computed(() => store.state.currentSurvey.loading)

const pdf = ref({})

function generateReport() {
	let html = htmlToPdfMake(pdf.value.innerHTML)

	const documentDefinition = {
		content: html,
		styles: {
			header: {
				fontSize: 22,
				color: 'black',
				bold: true
			},
			list: {
				markerColor: 'black',
				margin: [10, 5, 10, 10],
			},
			spacing: {
				margin: [10, 0, 0, 10]
			}
		}
	}

	pdfMake.vfs = pdfFonts.pdfMake.vfs
	pdfMake.createPdf(documentDefinition).download('survey', () => {
		router.push({
			name: 'SurveyAnswers',
			params: {
				id: survey.value.id
			}
		})
	})
}

onMounted(async () => {
	if (!route.params.slug) {
		return
	}
	await store.dispatch('getSurveyBySlug', route.params.slug)

	generateReport()
})

</script>
