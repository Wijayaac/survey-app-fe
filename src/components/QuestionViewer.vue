<template>
	<fieldset class="mb-4">
		<div>
			<legend class="text-base font-medium text-gray-900">
				{{ index + 1 }}. {{ question.question }}
			</legend>
			<p class="text-gray-500 text-sm">
				{{ question.description }} </p>
		</div>
		<div class="mt-3">
			<div v-if="question.type === 'select'">
				<select id="question-type" name="question-type" :value="modelValue"
								@change="emits('update:modelValue', $event.target.value)" class="mt-1 form-input" :disabled="disabled">
					<option value="">Please Select</option>
					<option v-for="option in question.data.options" :key="option.uuid" :value="option.text">{{
							option.text
						}}
					</option>
				</select>
			</div>
			<div v-else-if="question.type === 'radio'">
				<pre>
				</pre>
				<div v-for="(option) of question.data.options" :key="option.uuid" class="flex items-center">
					<input :id="option.uuid" :name="`question${question.id}`" :value="option.text"
								 @change="emits('update:modelValue', $event.target.value)" type="radio" class="form-check"
								 :checked="modelValue === option.text" :disabled="disabled"/>
					<label :for="option.uuid" class="ml-3 block text-sm font-medium text-gray-700">
						{{ option.text }}
					</label>
				</div>
			</div>
			<div v-else-if="question.type === 'checkbox'">
				<div v-for="option of question.data.options" :key="option.uuid" class="flex items-center">
					<input :id="option.uuid" :name="`question${question.id}`" :value="option.text" @change="onCheckboxChange"
								 type="checkbox" v-model="model[option.text]" class="form-check"
								 :checked="isChecked(modelValue, option.text)" :disabled="disabled"/>
					<label :for="option.uuid" class="ml-3 block text-sm font-medium text-gray-700">
						{{ option.text }}
					</label>
				</div>
			</div>
			<div v-else-if="question.type === 'text'">
				<input type="text" :name="question.id" :id="question.id" :value="modelValue"
							 @input="emits('update:modelValue', $event.target.value)" class="mt-1 form-input" :disabled="disabled">
			</div>
			<div v-else-if="question.type === 'textarea'">
        <textarea :name="question.id" :id="question.id" :value="modelValue"
									@input="emits('update:modelValue', $event.target.value)" class="mt-1 form-input" :disabled="disabled">
        </textarea>
			</div>
		</div>
	</fieldset>
	<hr class="mb-4">
</template>

<script setup>
import {ref} from "vue";

const {question, index, modelValue, disabled} = defineProps({
	index: Number,
	question: Object,
	modelValue: [String, Array],
	disabled: Boolean
})

const emits = defineEmits(['update:modelValue'])

let model;
if (question.type === 'checkbox') {
	model = ref({})
}

function onCheckboxChange() {
	const selectedOptions = []

	for (let text in model.value) {
		if (model.value[text]) {
			selectedOptions.push(text)
		}
	}
	emits('update:modelValue', selectedOptions)
}

function isChecked(selected = [], value = '') {
	return selected.includes(value)
}
</script>
