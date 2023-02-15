<template>
  <div>
    <h2
      class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
    >
      Register
    </h2>
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
      <span
        @click="errors = {}"
        class="w-8 h-8 btn !p-0 hover:bg-[rgba(0,0,0,0.2)]"
      >
        <XMarkIcon class="btn-icon !mr-0" />
      </span>
    </Alert>
    <input type="hidden" name="remember" value="true" />
    <div class="rounded-md shadow-sm">
      <TextInput label="Full name" name="fullName" v-model="user.name" />
      <EmailInput name="email" label="Email address" v-model="user.email" />
      <PasswordInput label="Password" name="password" v-model="user.password" />
      <PasswordInput
        label="Confirm Password"
        name="passwordConfirmation"
        v-model="user.password_confirmation"
      />
    </div>

    <div class="flex items-center justify-end">
      <router-link
        :to="{ name: 'login' }"
        class="font-medium text-sm text-indigo-600 hover:text-indigo-500"
      >
        Login with your account
      </router-link>
    </div>
    <div>
      <button
        type="submit"
        :disabled="loading"
        class="group relative w-full btn btn-indigo"
      >
        <span v-if="loading" class="flex items-center pl-3">
          <SpinnerIcon />
        </span>
        {{ loading ? "" : "Register account" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

import store from "../store/index.js";

const router = useRouter();

const user = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};
const loading = ref(false);

const errors = ref({});

function register() {
  loading.value = true;
  // console.log(user)

  store
    .dispatch("register", user)
    .then(() => {
      router.push({
        name: "dashboard",
      });
    })
    .catch((err) => {
      if (err.response.status === 422) {
        errors.value = err.response.data.errors;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
