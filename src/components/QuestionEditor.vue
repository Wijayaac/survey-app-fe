<template>
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold">
			{{ index + 1 }} . {{ model.question }} </h3>
		<div class="flex items-center">
			<!--  Delete new question -->
			<button type="button" @click="deleteQuestion" class="btn btn-red !py-1">
				<TrashIcon class="btn-icon"/>
				Delete
			</button>
		</div>
	</div>
	<div class="grid gap-3 grid-cols-12">
		<!-- Question -->
		<div class="mt-3 col-span-9">
			<label :for="`question-text-${model.data}`" class="block text-sm font-medium text-gray-700">
				Question Text
			</label>
			<input type="text" :name="`question-text-${model.data}`" v-model="model.question" @change="dataChange"
						 :id="`question-text-${model.data}`" class="mt-1 form-input"/>
		</div>
		<!-- Question type -->
		<div class="mt-3 col-span-3">
			<label for="question-type" class="block text-sm font-medium text-gray-700"> Select Question Type</label>
			<select id="question-type" name="question-type" v-model="model.type" @change="typeChange" class="mt-1 form-input">
				<option v-for="type in questionTypes" :key="type" :value="type">{{ upperCaseFirst(type) }}</option>
			</select>
		</div>
		<div class="mt-3 col-span-9">
			<label :for="`question-description-${model.id}`"
						 class="block text-sm font-medium text-gray-700">Description</label>
			<textarea :id="`question-description-${model.id}`" :name="`question-description-${model.id}`"
								v-model="model.description" @change="dataChange" class="mt-1 form-input">
      </textarea>
		</div>
		<!--  Question description-->
	</div>
	<!--  Data -->
	<div>
		<div v-if="shouldHaveOptions()" class="mt-2">
			<h4 class="flex justify-between items-center mb-1 text-sm font-semibold">
				Options
				<!--  Add new option-->
				<button type="button" @click="addOption" class="btn btn-grey !py-1 mb-2">
					<PlusCircleIcon class="btn-icon"/>
					Add Option
				</button>
			</h4>
			<div v-if="!model.data.options.length" class="py-3 text-xs text-gray-600 text-center">
				You don't have any options defined
			</div>
			<div v-for="(option,index) in model.data.options" :key="option.uuid" class="flex items-center mb-1">
				<span class="w-6 text-sm">{{ index + 1 }} .</span>
				<div class="w-full flex items-center justify-between ">
					<div class="w-full">
						<input type="text" v-model="option.text" @change="dataChange" class="form-input"/>
					</div>
					<div class="w-20 ml-2 h-full">
						<button type="button" @click="deleteOption(option)" class="btn w-full btn-red">
							<TrashIcon class="btn-icon p-0.5 !mr-0"/>
						</button>
					</div>
				</div>
			</div>
			<!-- Delete option-->
		</div>
	</div>

	<hr class="my-4">
</template>

<script setup>
import {ref, computed} from "vue";
import {v4 as uuidv4} from 'uuid'
import {TrashIcon, PlusCircleIcon} from "@heroicons/vue/24/outline/index.js";

import store from "../store/index.js";

const props = defineProps({
	question: Object,
	index: Number
})

const emit = defineEmits(["change", "deleteQuestion"])

const model = ref(JSON.parse(JSON.stringify(props.question)))

// Get question types from vuex
const questionTypes = computed(() => store.state.questionTypes)

function upperCaseFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function shouldHaveOptions() {
	return ["select", "radio", "checkbox"].includes(model.value.type);
}

function getOptions() {
	return model.value.data.options;
}

function setOptions(options) {
	model.value.data.options = options
}

function addOption() {
	setOptions([
		...getOptions(),
		{uuid: uuidv4(), text: ""}
	])
	dataChange();
}

function deleteOption(option) {
	setOptions(getOptions().filter((opt) => opt !== option))
	dataChange()
}

function typeChange() {
	if (shouldHaveOptions()) {
		setOptions(getOptions() || [])
	}
	dataChange()
}

function dataChange() {
	const data = JSON.parse(JSON.stringify(model.value));
	if (!shouldHaveOptions()) {
		delete data.data.options
	}

	emit('change', data)
}

function deleteQuestion() {
	emit('deleteQuestion', props.question)
}
</script>
