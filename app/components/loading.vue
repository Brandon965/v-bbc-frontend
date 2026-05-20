<script setup lang="ts">
defineProps<{is_pending?: boolean, is_error?: any}>()

// BWC Loading SVG

</script>

<template>
    <div class="status">
        <div class="loading">
            <div></div>
            <div class="title">Loading...</div>
            <div class="description">Please wait while we process your request. Do not refresh the page. </div>
        </div>  
        <!-- <div class="error" >
            <div>Error While Fetching Data</div>
            <div>{{ is_error.status }}</div>
            <div>{{ is_error.message }}</div>
        </div> -->
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

.status .loading {
    gap: 10px;
    padding: 10px;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
}

.status .loading .title {
    font-size: 20px;
}

.status .loading .description {
    width: 65%;
    color: #adadad;
    font-size: 14px;
    margin: 0 auto;
}

.status .loading .cancel {
    margin: 0 auto;
    font-size: 16px;
    padding: 10px 20px;
    width: fit-content;
    background-color: #0f070f9f;
}

.status .loading .cancel:hover {
    background-color: #1b0c1bd6;
}

.status .loading .cancel:active {
    background-color: #0a040ad6;
}

</style>
