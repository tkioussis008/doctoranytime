<script setup lang="ts">
import { ref } from "vue";
import { watch } from 'vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons';


</script>


<template>
  <div class="home">
    <div class="md:mx-auto max-w-3xl max-w-3xl flex flex-col h-screen justify-center items-center max-[767px]:mx-5 mb-60">
      <div class="w-45 h-10 absolute top-5 left-1/2 transform -translate-x-1/2 mt-4">
        <img src="@/assets/images/MindTime-logo.png" class="max-w-44 mb-8" alt="MindTime" />
      </div>
      <div class="space-y-6 py-8 text-base text-gray-500 leading-7 text-center">
        <h1 class="text-indigo-800 text-3xl pb-3 font-bold text-wrap">Questionnaire Completed!<br>
        Use this url to find your match</h1>
        <div> 
          <a href="https://www.doctoranytime.gr/s/Phychologos?sf=therapeia-zeygous_and_agxos&vcf=availablevideocall&spec=Psychiatros" class="underline hover:no-underline break-all">
            https://www.doctoranytime.gr/s/Phychologos?sf=therapeia-zeygous_and_agxos&vcf=availablevideocall&spec=Psychiatros
          </a>
        </div>
      </div>
    </div>
  </div>

</template>

