<script setup lang="ts">
const route = useRoute()

const { data, pending } = await useFetch('/api/download', {
    lazy: true,
    query: {
        data: route.query.data
    }
})

console.log(data.value?.download)




</script>

<template>
    <div class="section">
        <div class="options">
            <div class="loading" v-if="pending">Loading Data...</div>
            <div class="carousel" v-else v-for="page in data?.download">
                {{ console.log(page) }}
                <div class="prefix">{{ page.name }}</div>
                <div class="wrapper">
                    <div class="card" v-for="(item, index) in page.data">
                        <NuxtImg :src="`http://wsrv.nl/?url=${item.tempCover}&w=336`" width="336" fit="cover" />
                        <div class="volume">Volume {{ item.volume }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.section {
    gap: 20px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
}

.loading {
    text-align: center;
    width: 100%;
    height: fit-content;
    padding: 20px;
    font-size: 40px;
    color: #fff;
}

.options {
    gap: 10px;
    height: 100%;
    display: flex;
    height: fit-content;
    flex-direction: column;
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); */
}

.carousel {
    width: 100%;
    height: fit-content;
}

.carousel .wrapper {
    gap: 10px;
    display: flex;
    overflow-x: scroll;
    flex-direction: row;
}

.prefix {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}

.card {
    margin: 2px;
    width: 185px;
    height: 265px;
    position: relative;
    border: 4px #ffffff00 solid;
}

.card.selected {
    border: 4px #fff solid;
}

.card img {
    width: 180px;
    height: auto;
    overflow: hidden;
    object-fit: cover;
}

.card div {
    color: #fff;
    text-align: center;
}

.card .volume {
    top: 0;
    left: 0;
    margin: 5px;
    color: #fff;
    font-weight: 600;
    padding: 5px 10px;
    text-align: center;
    position: absolute;
    background-color: #0000007a;
}
</style>