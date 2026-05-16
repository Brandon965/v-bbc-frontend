<script setup lang="ts">
import { compareImages } from '~/lib/compare'

const route = useRoute()

const queries = String(route.query.data).split('&')
const total_ids = queries.map((query) => { return { id: query.split('=')[0] } })

const { data, pending } = await useFetch('/api/download', {
    lazy: true,
    query: {
        data: route.query.data
    }
})

const compareData = ref([])

watch(pending, (value) => {
    if (!value) {
        compareData.value = compareImages(data.value?.download)

        // console.log(compareData.value)
        // let test_id: string = ''
        // let multiple_id = false
        // total_ids.forEach((id) => {
        //     if (test_id == '') { test_id = String(id) }
        //     multiple_id = test_id != '' && test_id !== String(id)
        // })
    }
})


</script>

<template>
    <div class="section">
        <div class="options">
            <div class="loading" v-if="pending">Loading Data...</div>
            <div class="carousel" v-else>
                <div class="wrapper">
                    <template v-for="(item, index) in compareData">
                        <div class="card" v-if="item[0] != undefined">
                            <NuxtImg :src="`${item[0].link}`" width="336" fit="cover" />
                            <div class="volume">Volume {{ item[0].volume }}</div>
                            <div class="size">{{ item[0].size.replace('*', 'x') }}</div>
                        </div>
                    </template>
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
}

.carousel {
    width: 100%;
    height: fit-content;
}

.carousel .wrapper {
    gap: 10px;
    display: flex;
    width: fit-content;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 0 auto;
    justify-content: center;
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

.card .size {
    bottom: 0;
    right: 0;
    margin: 15px 10px;
    color: #fff;
    font-weight: 600;
    padding: 5px 10px;
    text-align: center;
    position: absolute;
    background-color: #0000007a;
}
</style>