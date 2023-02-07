<template>
	<div class="inline-flex items-center">
		<input type="checkbox" @change="onInput($event)" :value="inputValue" :autocomplete="name" class="form-check"
					 :id="name" :placeholder="label">
		<label :for="name" class="ml-2 block text-sm text-gray-900">{{ label }}</label>
	</div>
	<span class="text-xs text-red-500" v-show="errorMessage">{{ errorMessage }}</span>
</template>

<script setup>
import {useField} from "vee-validate";
import {toRef} from "vue";

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
		type: Boolean,
	}
})

const emits = defineEmits(['update:modelValue'])
const nameRef = toRef(props, 'name');

const {
	errorMessage,
	value: inputValue,
	handleChange
} = useField(nameRef, null, {
	initialValue: props.modelValue,
	valueProp: props.modelValue
})

function onInput(event) {
	handleChange(event.target.value, false)
	// console.log(inputValue.value)
	// emits('update:modelValue', event.target.value)
	// console.log(event.target.value)
	// console.log(event.target.value)
}
</script>
