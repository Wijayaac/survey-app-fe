<template>
	<div>
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register</h2>
	</div>
	<form class="mt-8 space-y-6" @submit.prevent="register">
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
		<input type="hidden" name="remember" value="true">
		<div class=" rounded-md shadow-sm">
			<div class="mb-3">
				<label for="full-name" class="sr-only">Full Name</label>
				<input id="full-name" v-model="user.name" name="name" type="text" autocomplete="name" required
							 placeholder="Full name" class="form-input">
			</div>
			<div class="mb-3">
				<label for="email-address" class="sr-only">Email address</label>
				<input id="email-address" v-model="user.email" name="email" type="email" autocomplete="email" required
							 placeholder="Email address" class="form-input">
			</div>
			<div class="mb-3">
				<label for="password" class="sr-only">Password</label>
				<input id="password" v-model="user.password" name="password" type="password" autocomplete="password" required
							 placeholder="Password" class="form-input">
			</div>
			<div class="mb-3">
				<label for="confirmation-password" class="sr-only">Password Confirmation</label>
				<input id="confirmation-password" v-model="user.password_confirmation" name="confirmation" type="password"
							 autocomplete="passwordConfirmation" required placeholder="Confirm your password" class="form-input">
			</div>
		</div>

		<div class="flex items-center justify-end">
			<router-link :to="{name:'Login'}" class="font-medium text-sm text-indigo-600 hover:text-indigo-500">
				Login with your account
			</router-link>
		</div>
		<div>
			<button type="submit" :disabled="loading" class="group relative w-full btn btn-indigo">
          <span v-if="loading" class="flex items-center pl-3">
            <SpinnerIcon/>
          </span>
				{{ loading ? '' : 'Register account' }}
			</button>
		</div>
	</form>
</template>

<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import {XMarkIcon,} from "@heroicons/vue/24/outline";

import store from "../store/index.js";
import Alert from "../components/Alert.vue";
import SpinnerIcon from "../assets/SpinnerIcon.vue";

const router = useRouter()

const user = {
	name: '',
	email: '',
	password: '',
	password_confirmation: ''
}
const loading = ref(false)

const errors = ref({});

function register() {
	loading.value = true
	store.dispatch('register', user).then(() => {
		router.push({
			name: 'Dashboard'
		})
	}).catch((err) => {
		if (err.response.status === 422) {
			errors.value = err.response.data.errors
		}
	}).finally(() => {
		loading.value = false
	})
}
</script>
