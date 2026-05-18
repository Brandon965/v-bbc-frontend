<script setup lang="ts">
import { compareImages } from '~/lib/compare'
import type { CompareData } from '~/types/main'
const config = useRuntimeConfig()

const route = useRoute()
const query = route.query.data

const { data, pending } = await useFetch(`${config.public.apiBase}/api/get`, { lazy: true, query: { data: query } })

const compareData = ref<CompareData>([])
const selected = reactive<any[]>([])
const isShiftHeld = ref(false)
const lastSelected = ref(0)

onMounted(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Shift') isShiftHeld.value = true }
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === 'Shift') isShiftHeld.value = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
    })
})

watch(pending, (value) => {
    if (!value) {
        console.log(data.value?.get)
        compareData.value = compareImages(data.value?.get)
    }
})

const selectedData = (index: number) => {
    if (isShiftHeld.value) {
        if (index > lastSelected.value) {
            for (let i = lastSelected.value; i <= index; i++) {
                selected[i] = ''
            }
        } else if (index < lastSelected.value) {
            for (let i = lastSelected.value; i >= index; i--) {
                selected[i] = undefined
            }
        }
    } else {
        selected[index] = selected[index] != undefined ? undefined : ''
    }
    lastSelected.value = index
}

const copyLinks = () => {
    let e = ''
    selected.forEach((value, index) => {
        if (value != undefined) {
            e = e + compareData.value[index]?.[0].link + `\n`
        }
    })

    navigator.clipboard.writeText(e)
}

const download = async () => {
    const links = selected
        .map((value, index) => value != undefined ? compareData.value[index]?.[0].link : null)
        .filter(Boolean)
        .join('&')

    if (!links) return
    const { data } = await useFetch('/api/download', { lazy: true, query: { data: links } })

    const byteArray = Uint8Array.from(atob(data.value?.download), c => c.charCodeAt(0))
    const blob = new Blob([byteArray], { type: 'application/zip' })

    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'images.zip' })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url);
}

</script>

<template>
    <div class="section">
        <div class="options">
            <div class="loading" v-if="pending">Loading Data...</div>
            <div class="carousel">
                <div class="wrapper">
                    <template v-for="(item, index) in compareData">
                        <div class="card" v-if="item[0] != undefined"
                            :class="`${selected[index] !== undefined ? 'selected' : ''}`"
                            @click="(e) => { selectedData(index) }">
                            <NuxtImg :src="`${item[0].link}`" width="336" fit="cover" densities="x1"
                                draggable="false" />
                            <div class="volume">Volume {{ item[0].volume }}</div>
                            <div class="size">{{ item[0].size.replace('*', 'x') }}</div>
                            <div class="source">{{ item[0].source }}</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="truffle">
            <div class="button" @click="copyLinks">Copy Links</div>
            <div class="button" @click="download">Download</div>
        </div>
    </div>
</template>

<style scoped>
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
</style>

<style>
.section {
    gap: 20px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
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


.prefix {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}

.card {
    width: 185px;
    overflow: hidden;
    position: relative;
    height: 290px;
    background-color: rgb(21, 17, 22)a3;
    border: 4px #ffffff00 solid;
}

.card.selected {
    border: 4px #e979ff solid;
}

.card img {
    width: 185px;
    height: 270px;
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

.card .source {
    line-height: 15px;
}

.card .size {
    bottom: 20px;
    right: 0;
    margin: 5px;
    color: #fff;
    font-weight: 600;
    padding: 5px 5px;
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
    position: fixed;
    flex-direction: row;
    transform: translate(-50%, -50%);
    background-color: #0e0015a3;
}

.truffle .button {
    color: #fff;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    background-color: #151116;
}

.truffle .button:hover {
    background-color: #262626;
}

.truffle .button:active {
    background-color: #0e0e0e;
}
</style>