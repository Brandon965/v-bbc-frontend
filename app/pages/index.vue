<script setup lang="ts">
import type { SearchData } from '~/types/main'
const config = useRuntimeConfig()

const page_data = shallowRef<SearchData[]>([])
const is_pending = shallowRef<boolean>(false)
const selected = reactive({
    bw: [],
    "bw-p": []
})

const deserializeSearch = (raw: any): SearchData => ({
    ...raw,
})

const keyPressed = async (e: KeyboardEvent, inputValue) => {
    if (e.code == 'Enter') {
        page_data.value = []
        is_pending.value = true
        const data = await $fetch(`${config.public.apiBase}/api/search`, { lazy: true, query: { title: inputValue }, transform: (item) => item.search.map(deserializeSearch) })
        page_data.value = data.search
        is_pending.value = false
    }
}

const openPage = () => {
    let query = ''
    const router = useRouter()
    for (const key in selected) {
        selected[key].forEach((element, index) => {
            if (element != undefined) {
                query = `${query}${query != '' ? '&' : ''}${key}=${element}`
            }
        });
    }
    router.push({ path: '/compare', query: { data: query } })
}

const selectedData = (r, pageId, index) => {
    if (selected[pageId][index] != undefined) {
        selected[pageId][index] = undefined
    } else {
        selected[pageId][index] = r
    }
}

</script>

<template>
    <div class="section">
        <input type="text" @keypress="keyPressed($event, $event.target?.value)">
        <div class="options">
            <div class="loading" v-if="is_pending">Loading Data...</div>
            <div class="carousel" v-for="page in page_data" v-else>
                <div class="prefix">{{ page.name }}</div>
                <div class="wrapper">
                    <div class="card" v-for="(item, index) in page.data"
                        :class="`${selected[`${page.id}`][index] === `${item.link}` ? 'selected' : ''}`"
                        @click="(e) => { selectedData(`${item.link}`, `${page.id}`, `${index}`) }">
                        <NuxtImg :src="item.cover" width="336" height="478" />
                        <div class="tag">{{ item.tag }}</div>
                        <div>{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="truffle">
            <div class="button" @click="openPage()">Open</div>
        </div>
    </div>
</template>

<style scoped>
.card {
    z-index: 1;
    margin: 2px;
    min-width: 180px;
    max-width: 180px;
    height: fit-content;
    overflow: hidden;
    position: relative;
    background-color: #070307;
    border: 4px #ffffff00 solid;
}
</style>

<style>
.section {
    gap: 20px;
    display: flex;
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

.section input {
    height: 30px;
    font-size: 20px;
}

.section input:focus {
    border: none;
    outline: none;
}

.options {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.carousel {
    width: 100vw;
    height: fit-content;
}

.carousel .wrapper {
    gap: 10px;
    margin: 0;
    width: 100%;
    display: flex;
    overflow-x: auto;
    flex-direction: row;
}

.prefix {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
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

.card .tag {
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

.truffle {
    gap: 5px;
    bottom: 0;
    left: 50%;
    width: fit-content;
    padding: 10px;
    display: flex;
    z-index: 1;
    position: absolute;
    flex-direction: row;
    transform: translate(-50%, -50%);
    background-color: #0e0015a3;
}

.truffle .button {
    background-color: #1b1b1b;
    color: #fff;
    padding: 10px;
    text-align: center;
}

.truffle .button:hover {
    background-color: #262626;
}

.truffle .button:active {
    background-color: #0e0e0e;
}
</style>
