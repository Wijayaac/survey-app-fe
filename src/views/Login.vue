<template>
  <div>
    <h2
      class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
    >
      Login
    </h2>
  </div>
  <form class="mt-8 space-y-6" @submit.prevent="login">
    <Alert v-if="errorMessage">
      {{ errorMessage }}
      <span
        @click="errorMessage = ''"
        class="w-8 h-8 btn !p-0 hover:bg-[rgba(0,0,0,0.2)]"
      >
        <XMarkIcon class="btn-icon !mr-0" />
      </span>
    </Alert>
    <input type="hidden" name="remember" value="true" />
    <div class="-space-y-px rounded-md shadow-sm">
      <EmailInput label="Email address" name="email" v-model="user.email" />
      <PasswordInput label="Password" name="password" v-model="user.password" />
    </div>
    <div class="flex items-center justify-between">
      <!--			<CheckboxInput label="Remember me" name="rememberMe" v-model="user.remember"/>-->
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="user.remember"
          name="remember-me"
          type="checkbox"
          class="form-check"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900"
          >Remember me</label
        >
      </div>
      <div>
        <router-link
          :to="{ name: 'register' }"
          class="font-medium text-sm text-indigo-600 hover:text-indigo-500"
        >
          Register here
        </router-link>
      </div>
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
        {{ loading ? "" : "Sign in" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

import store from "../store/index.js";
import Alert from "../components/Alert.vue";
import SpinnerIcon from "../assets/SpinnerIcon.vue";
import EmailInput from "../components/Form/EmailInput.vue";
import PasswordInput from "../components/Form/PasswordInput.vue";
import CheckboxInput from "../components/Form/CheckboxInput.vue";

const router = useRouter();
let errorMessage = ref("");

const user = {
  email: "",
  password: "",
  remember: false,
};
const loading = ref(false);

function login() {
  loading.value = true;
  store
    .dispatch("login", user)
    .then(() => {
      router.push({
        name: "dashboard",
      });
    })
    .catch(({ response }) => {
      errorMessage.value = response.data.error;
      let errors = [];
      if (response.data.errors) {
        for (const errorsKey in response.data.errors) {
          errors = response.data.errors[errorsKey];
        }
        errorMessage.value = errors.join("");
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
