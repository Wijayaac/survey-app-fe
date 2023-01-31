<template>
  <div>
    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
         alt="Your Company">
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register</h2>
  </div>
  <form class="mt-8 space-y-6" @submit.prevent="register">
    <div v-if="errorMessage"
         class="flex items-center justify-between px-4 py-4 rounded bg-red-500 text-white text-sm font-semibold">
      {{ errorMessage }}
      <span @click="errorMessage = ''"
            class="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </span>
    </div>
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
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <!-- Heroicon name: mini/lock-closed -->
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
        Register account
      </button>
    </div>
  </form>
</template>

<script setup>

import store from "../store/index.js";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
let errorMessage = ref('')

const user = {
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
}

function register() {
  store.dispatch('register', user).then((response) => {
    console.log(response)
    router.push({
      name: 'Dashboard'
    })
  }).catch(({response}) => {
    errorMessage.value = response.data.error
  })
}
</script>

<style scoped>

</style>
