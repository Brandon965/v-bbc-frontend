<script setup lang="ts">
import Display from './components/display.vue';


</script>

<template>
   <NuxtLoadingIndicator />
   <Display />
   <NuxtPage />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

* {
    font-family: "Rubik", sans-serif;
    -webkit-user-select: none;
    user-select: none;
}

body {
   margin: 0;
   border: none;
   width: 100vw;
   height: 100vh;
   overflow-x: hidden;
   background-color: #040204;
}

#__nuxt {
   padding: 20px;
}
</style>
