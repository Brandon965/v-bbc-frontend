<script setup lang="ts">
import Loading from '~/components/loading.vue'
import type { SearchData } from '~/types/main'

const config = useRuntimeConfig()

const page_data = ref<SearchData[]>([])
const is_pending = shallowRef<boolean>(false)
const is_error = shallowRef({
    error: false,
    message: '',
    status: ''
})

const selected = ref<Record<string, string[]>>({
    "bl": [],
    "bw": [],
    "bw-p": [],
})

const keyPressed = async (e: KeyboardEvent) => {
    if (e.code == 'Enter') {
        page_data.value = []
        is_pending.value = true
        for (const key in selected.value) {
            page_data.value.push({
                name: '',
                id: '',
                data: []
            })

            await useFetch(`${config.public.apiBase}/api/search`, { lazy: true, query: { title: e.target!.value, module: key } })
                .then(({ data, status }) => {
                    if (status.value == 'success') {
                        is_pending.value = false
                        page_data.value.splice(page_data.value.length - 1, 1)
                        page_data.value.push(data.value?.search)
                    }
                })
        }


        // if (error.value?.status != undefined) {
        //     is_error.value.error = true
        //     console.log(error.value?.statusCode)
        //     // is_error.value.status = String(error.value?.statusCode)
        //     // is_error.value.message = String(error.value?.cause)
        // }
        // page_data.value = data!.value
        // is_pending.value = false
    }
}

const openPage = () => {
    let query = ''
    const router = useRouter()
    for (const key in selected.value) {
        selected.value[key]?.forEach((element, index) => {
            if (element != undefined) {
                query = `${query}${query != '' ? '&' : ''}${key}=${element}`
            }
        });
    }
    router.push({ path: '/compare', query: { data: query } })
}

const selectedData = (r: string, pageId: string, index: string) => {
    if (selected.value[pageId])
        selected.value[pageId][Number(index)] = selected.value[pageId]?.[Number(index)] !== undefined ? undefined : r
}

</script>

<template>
    <div class="section">
        <input type="text" @keypress="keyPressed($event)">
        <div class="options">
            <div class="carousel" v-for="page in page_data">
                <Loading v-if="page.data.length == 0" />
                <div class="prefix" v-if="page.data">{{ page.name }}</div>
                <div class="wrapper" v-if="page.data">
                    <div class="card" v-for="(item, index) in page.data"
                        :class="`${selected[`${page.id}`]?.[index] === `${item.link}` ? 'selected' : ''}`"
                        v-on:load="selected[`${page.id}`][index] = null"
                        @click="(e) => { selectedData(`${item.link}`, `${page.id}`, `${index}`) }">
                        <NuxtImg :src="item.cover" width="336" height="478" />
                        <div class="tag">{{ item.tag }}</div>
                        <div>{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="truffle">
        <div class="button" @click="openPage()">Open</div>
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
    overflow-y: scroll;
    overflow-x: hidden;
    flex-direction: column;
}

.carousel {
    width: 100vw;
    height: fit-content;
    border-bottom: 1px #fff solid;
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
    border: 4px #e979ff solid;
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
    position: fixed;
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
