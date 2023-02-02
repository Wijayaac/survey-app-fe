<template>
  <div
      class="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[370px]">
    <img :src="survey.image" alt="" class="w-full h-48 object-cover"/>
    <h4 class="mt-4 text-lg font-bold">{{ survey.title }}</h4>
    <div v-html="survey.description" class="overflow-hidden flex-1 truncate"></div>
    <div class="flex justify-between items-center mt-3">
      <router-link :to="{name: 'SurveyView', params: {id: survey.id}}" class="btn btn-indigo">
        <PencilIcon class="w-4 h-4 mr-2"/>
        Edit
      </router-link>
      <div class="flex items-center">
        <a :href="`/view/survey/${survey.slug}`" target="_blank" class="btn btn-plain mr-2">
          <ExternalIcon class="w-4 h-4"/>
        </a>
        <button v-if="survey.id" @click="emit('delete', survey)" class="btn btn-red">
          <TrashIcon class="w-4 h-4"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {PencilIcon, ArrowTopRightOnSquareIcon as ExternalIcon, TrashIcon} from "@heroicons/vue/24/outline/index.js";

const {survey} = defineProps({
  survey: Object
})
const emit = defineEmits(['delete'])
</script>

<style scoped>

</style>
