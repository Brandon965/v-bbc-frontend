<script setup lang="ts">
defineProps<{isError?: any}>()

// BWC Error SVG

</script>

<template>
    <div class="status">
        <div class="error">
            <div></div>
            <div class="title">Loading...</div>
            <div class="description">Please wait while we process your request. Do not refresh the page. </div>
        </div>  
    </div>
</template>

<style>
.status {
    color: #fff;
    padding: 10px;
    margin: auto auto;
    width: fit-content;
    position: relative;
    justify-content: center;
    /* transform: translate(-50%, 0%); */
}

.status .error {
    gap: 10px;
    padding: 10px;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
}

.status .error .title {
    font-size: 20px;
}

.status .error .description {
    width: 65%;
    color: #adadad;
    font-size: 14px;
    margin: 0 auto;
}

.status .error .cancel {
    margin: 0 auto;
    font-size: 16px;
    padding: 10px 20px;
    width: fit-content;
    background-color: #0f070f9f;
}

.status .error .cancel:hover {
    background-color: #1b0c1bd6;
}

.status .error .cancel:active {
    background-color: #0a040ad6;
}

</style>
