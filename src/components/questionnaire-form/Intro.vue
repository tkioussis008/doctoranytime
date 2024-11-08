<script setup lang="ts">
import { ref } from "vue"
import { watch } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'


</script>


<template>
  <div class="questions">
    
      <img src="@/assets/images/central-image.png" class="md:max-w-xl max-w-sm mb-8" alt="MindTime Central Image" />
      
        <div class="space-y-6 py-8 text-base text-gray-500 leading-7 text-center">
          <h1 class="text-indigo-800 text-3xl font-bold">Get matched with Top Mental Health Specialists</h1>
          <div> 
            <p class="bg-emerald-50 text-emerald-500 px-2 py-1 text-xs text-center rounded inline-block inline-flex items-center">
              <FontAwesomeIcon :icon="faClock" /> <span class="pl-2">2 minutes to complete</span></p>
          </div>
          <p>Answer a few quick questions to receive a shortlist of trusted professionals tailored to your needs.</p>

            <div class="relative bg-white px-4 pt-5 pb-4 text-left ring-1 ring-gray-900/5 rounded">
              <h5 class="font-semibold pb-4">How It Works</h5>
              <ol class="space-y-3 text-sm list-outside list-decimal">
                <li class="flex items-top">
                  <span class="w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-white mr-3 text-[10px] px-2">1</span>
                    Answer a set of questions
                </li>
                <li class="flex items-top">
                  <span class="w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-white mr-3 text-[10px] px-2">2</span>
                    Our engine analyzes your answers, your profile, and over 1000 specialists' information.
                </li>
                <li class="flex items-top">
                  <span class="w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-white mr-3 text-[10px] px-2">3</span>
                    Get a shortlist and schedule your initial appointment
                </li>
              </ol>
            </div>

        </div>
      
    </div>
    
  
</template>

