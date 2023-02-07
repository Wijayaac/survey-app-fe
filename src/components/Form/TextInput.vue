<template>
	<div class="mb-3">
		<label :for="name" class="sr-only">{{ label }}</label>
		<input type="text" :value="inputValue" :autocomplete="name" class="form-input" :id="name" @input="onInput($event)"
					 :placeholder="label">
		<span class="text-xs text-red-500" v-show="errorMessage">{{ errorMessage }}</span>
	</div>
</template>

<script setup>
import {useField} from "vee-validate";
import {toRef} from "vue";
import * as yup from 'yup'


const props = defineProps({
	name: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	modelValue: {
		type: String,
		default: ""
	}
})

const emits = defineEmits(['update:modelValue'])
const nameRef = toRef(props, 'name');

const {
	errorMessage,
	value: inputValue,
	handleChange
} = useField(nameRef, yup.string().required(), {
	initialValue: props.modelValue,
	valueProp: props.modelValue
})

function onInput(event) {
	handleChange(event, true)
	emits('update:modelValue', event.target.value)
}
</script>

