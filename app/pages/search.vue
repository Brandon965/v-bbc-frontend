<script setup lang="ts">
import type { SearchData } from '~/types/main'

const config = useRuntimeConfig()

const pageData = ref<SearchData[]>([])
const selected = ref<Record<string, string[]>>({
    "bl": [],
    "bw": [],
    "bw-g": [],
    "bw-p": [],
    "ebj": [],
})

const route = useRoute()
const router = useRouter()

const fetchModules = async (input?: string, force: boolean = false) => {
    if (pageData.value.length != 0) pageData.value = []

    for (const module in selected.value) {
        const key = `${module}-last-search`
        const cached = sessionStorage.getItem(key)

        pageData.value.push({ name: '', id: '', data: [] })

        if (cached && !force) {
            const { data, fetchedAt, searched } = JSON.parse(cached)
            const expiration = new Date(fetchedAt)
            expiration.setTime(expiration.getTime() + 30 * 1000)
            pageData.value.splice(pageData.value.length - 1, 1)
            if (searched !== input) {
                fetchModules(input, true)
                return
            }
            if (expiration.getTime() < Date.now()) {
                if (data.data.length !== 0)
                    pageData.value.push(data)
            }
        } else {
            const response = await $fetch<{ search: SearchData }>(`${config.public.apiBase}/api/search`, {
                query: { title: input, module: module }
            })

            sessionStorage.setItem(key, JSON.stringify({ data: response.search, fetchedAt: new Date(), searched: input }))
            pageData.value.splice(pageData.value.length - 1, 1)
            if (response?.search.data.length != 0)
                pageData.value.push(response?.search)
        }
    }
}

const openPage = () => {
    const query = Object.entries(selected.value)
        .flatMap(([key, values]) =>
            values
                .filter((v): v is string => v !== undefined)
                .map(v => `${key}=${v}`)
        )
        .join('&')

    router.push({ path: '/compare', query: { data: query } })
}

const keyPressed = async (event: KeyboardEvent) => {
    if (event.code == 'Enter') {
        router.push({ query: { search: event.target?.value } })
        await fetchModules(event.target?.value)
    }
}

const selectedData = (r: string, pageId: string, index: string) => {
    const page = selected.value[pageId]
    if (!page) return

    page[Number(index)] = page[Number(index)] !== undefined ? undefined : r
}


onMounted(() => {
    if (route.query.search) {
        fetchModules(route.query.search.toString())
    } else {
        router.push({ query: { search: '' } })
    }
})

</script>

<template>
    <section class="base">
        <div class="container">
            <input type="text" @keypress="keyPressed">
            <div class="box">
                <div class="carousel" v-for="page in pageData">
                    <Loading v-if="page.data.length == 0" />
                    <div class="prefix" v-if="page.data.length != 0">
                        <img :src="moduleIcon[page.name]" class="icon">
                        <div>{{ page.name }}</div>
                    </div>
                    <div class="wrapper" v-if="page.data.length != 0">
                        <div class="card" v-for="(item, index) in page.data"
                            :class="`${selected[`${page.id}`]?.[index] === `${item.link}` ? 'selected' : ''}`"
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

        input {
            border: none;
            height: 30px;
            outline: none;
            font-size: 20px;
            color: #ffffff;
            background-color: #38323e;

            &:focus {
                outline: none;
                border-radius: 2px;
                border: 2px #5c5068 solid;
            }
        }

        .box {
            height: 100%;
            display: flex;
            overflow-y: scroll;
            overflow-x: hidden;
            flex-direction: column;

            .carousel {
                height: fit-content;
                border-bottom: 1px #fff solid;

                .prefix {
                    gap: 5px;
                    color: #fff;
                    display: flex;
                    font-size: 18px;
                    font-weight: 600;
                    flex-direction: row;

                    .icon {
                        width: 20px;
                        height: 20px;
                    }
                }

                .wrapper {
                    gap: 10px;
                    margin: 0;
                    width: 100%;
                    display: flex;
                    overflow-x: auto;
                    flex-direction: row;

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

                        .tag {
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

                        img {
                            width: 180px;
                            height: 256px;
                            overflow: hidden;
                            object-fit: cover;
                        }

                        div {
                            color: #fff;
                            text-align: center;
                        }

                        &.selected {
                            border: 4px #e979ff solid;
                        }
                    }
                }
            }
        }
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

        .button {
            background-color: #1b1b1b;
            color: #fff;
            padding: 10px;
            text-align: center;

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