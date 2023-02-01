<template>
  <div>
    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
         alt="Your Company">
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
      <span @click="errors = {}"
            class="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </span>
    </Alert>
    <input type="hidden" name="remember" value="true">
    <div class=" rounded-md shadow-sm">
      <div class="mb-3">
        <label for="full-name" class="sr-only">Full Name</label>
        <input id="full-name" v-model="user.name" name="name" type="text" autocomplete="name" required
               class="relative block w-full appearance-none  rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Full name">
      </div>
      <div class="mb-3">
        <label for="email-address" class="sr-only">Email address</label>
        <input id="email-address" v-model="user.email" name="email" type="email" autocomplete="email" required
               class="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Email address">
      </div>
      <div class="mb-3">
        <label for="password" class="sr-only">Password</label>
        <input id="password" v-model="user.password" name="password" type="password" autocomplete="password"
               required
               class="relative block w-full appearance-none  rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Password">
      </div>
      <div class="mb-3">
        <label for="confirmation-password" class="sr-only">Password Confirmation</label>
        <input id="confirmation-password" v-model="user.password_confirmation" name="confirmation" type="password"
               autocomplete="passwordConfirmation" required
               class="relative block w-full appearance-none  rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Confirm your password">
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
      </div>

      <div class="text-sm">
        <router-link :to="{name:'Login'}" class="font-medium text-indigo-600 hover:text-indigo-500">Login with your
          account
        </router-link>
      </div>
    </div>

    <div>
      <button type="submit"
              :disabled="loading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span v-if="loading" class="flex items-center pl-3">
          <svg class="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
          </span>
        {{ loading ? '' : 'Register account' }}
      </button>
    </div>
  </form>
</template>

<script setup>

import store from "../store/index.js";
import {useRouter} from "vue-router";
import {ref} from "vue";
import Alert from "../components/Alert.vue";

const router = useRouter()
let errorMessage = ref('')

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
  store.dispatch('register', user).then((response) => {
    console.log(response)
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

<style scoped>

</style>
