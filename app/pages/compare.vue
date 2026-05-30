<script setup lang="ts">
import Error from '~/components/error.vue'
import Loading from '~/components/loading.vue'
import { copyLinks } from '~/composables/utils'
import { compareImages } from '~/lib/compare'
import type { CompareData, SearchData } from '~/types/main'

const route = useRoute()
const query = route.query.data

const cached = ref(false)
const config = useRuntimeConfig()
const lastSelected = ref<number>(0)
const isShift = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const isError = ref<string | null>(null)
const compareData = ref<CompareData>([])
const selected = reactive<(string | undefined)[]>([])

const cache = sessionStorage.getItem(`last-compare`)
if (cache) {
    const { searched } = JSON.parse(cache)
    if (searched == query) cached.value = true
}

if (cached.value) {
    const { data } = JSON.parse(cache)
    compareData.value = await compareImages(data)
    isLoading.value = false
} else {
    const { data: fetchData, status: fetchStatus, error: fetchError, refresh } = await useFetch<{ get: SearchData[] }>(
        `${config.public.apiBase}/api/get`,
        {
            lazy: true,
            query: { data: query },
            onResponseError({ response }) {
                isError.value = `Request failed: ${response.status} ${response.statusText}`
            },
            onResponse({ response }) {
                if (!response.ok) {
                    isError.value = `HTTP error: ${response.status}`
                }
            }
        }
    )

    watch(fetchStatus, async (newStatus) => {
        if (newStatus === 'success') {
            try {
                if (fetchData.value?.get && Array.isArray(fetchData.value.get)) {
                    sessionStorage.setItem(`last-compare`, JSON.stringify({ data: fetchData.value.get, searched: query }))
                    compareData.value = await compareImages(fetchData.value.get)
                    console.log(compareData.value)
                } else {
                    isError.value = 'Invalid data format received'
                }
            } catch (e) {
                isError.value = `Error processing data: ${e instanceof Error ? e.toRaw : 'Unknown error'}`
            } finally {
                isLoading.value = false
            }
        } else if (newStatus === 'error') {
            isError.value = fetchError.value?.message || 'Unknown error occurred'
            isLoading.value = false
        }
    }, { immediate: true })
}

const selectedData = (index: number) => {
    if (isShift.value) {
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

onMounted(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Shift') isShift.value = true }
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === 'Shift') isShift.value = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('keyup', onKeyUp)
    })
})

</script>

<template>
    <section class="base">
        <div class="container">
            <Error v-if="isError" />
            <Loading v-if="isLoading" scale="scale(150%)"/>
            <!-- <div v-else-if="!compareData && Object.keys(compareData).length <= 0" class="no-data">
                <p>No Data Available!</p>
            </div> -->
            <div v-else class="list">
                <div class="wrapper">
                    <template v-for="(item, index) in compareData" :key="Number(index)">
                        <div class="card" v-if="item && item[0]"
                            :class="`${selected[index] !== undefined ? 'selected' : ''}`"
                            @click="selectedData(Number(index))">
                            <NuxtImg :src="item[0].link" width="336" fit="cover" densities="x1" draggable="false" />
                            <div class="volume">Volume {{ item[0].volume }}</div>
                            <div class="size">{{ item[0].size?.replace('*', 'x') }}</div>
                            <div class="source">
                                <img :src="moduleIcon[item[0].source]" class="icon">
                                <div>{{ item[0].source }}</div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="truffle" v-if="compareData && Object.keys(compareData).length > 0">
            <div class="button" @click="copyLinks(selected, compareData)">Copy Links</div>
            <div class="button" @click="download(selected, compareData)">Download</div>
        </div>
    </section>
</template>

<style lang="less">
.base {
    .container {
        gap: 10px;
        width: 100%;
        display: flex;
        height: fit-content;
        flex-direction: column;

        .list {
            width: 100%;
            display: flex;
            height: fit-content;
            flex-direction: column;

            .wrapper {
                gap: 10px;
                display: flex;
                margin: 0 auto;
                flex-wrap: wrap;
                width: fit-content;
                flex-direction: row;
                padding-bottom: 100px;
                overflow: hidden scroll;
                justify-content: center;

                .card {
                    height: 295px;
                    overflow: hidden;
                    width: fit-content;
                    position: relative;
                    border: 4px #ffffff00 solid;
                    background-color: rgb(21, 17, 22);

                    img {
                        width: 185px;
                        height: 270px;
                        overflow: hidden;
                        object-fit: cover;
                    }

                    div {
                        color: #fff;
                        text-align: center;
                    }

                    .source {
                        gap: 5px;
                        height: 20px;
                        display: flex;
                        margin: 0 auto;
                        width: fit-content;
                        align-items: center;
                        flex-direction: row;

                        .icon {
                            width: 20px;
                            height: 20px;
                        }
                    }

                    .size {
                        right: 0;
                        margin: 5px;
                        bottom: 20px;
                        color: #fff;
                        font-weight: 600;
                        padding: 5px 5px;
                        text-align: center;
                        position: absolute;
                        background-color: #0000007a;
                    }

                    .volume {
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

                    &.selected {
                        border: 4px #e979ff solid;
                    }
                }
            }
        }

        .no-data {
            color: #fff;
            font-size: 30px;
            text-align: center;
        }
    }

    .truffle {
        gap: 5px;
        left: 50%;
        bottom: 0;
        padding: 10px;
        display: flex;
        position: fixed;
        width: fit-content;
        flex-direction: row;
        transform: translate(-50%, -50%);
        background-color: #0e0015a3;

        .button {
            color: #fff;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            background-color: #151116;

            &:hover {
                background-color: #262626;
            }

            &:active {
                background-color: #0e0e0e;
            }
        }
    }
}
</style>