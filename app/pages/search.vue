<script setup lang="ts">
import { useConfig } from '~/composables/config'
import type { SearchData } from '~/types/main'

const config = useRuntimeConfig()

const providers = useConfig().config.value.providers
const mature = useConfig().config.value.mature

const isSearching = ref<boolean>(false)
const modules = ref<SearchData[]>(modulesTemplate)
const selected = ref<Record<string, (string | undefined)[]>>(Object.fromEntries(modulesTemplate.map(id => [id.id, []])))

const route = useRoute()
const router = useRouter()

const fetchModules = async (input?: string) => {
    if (isSearching.value) return
    isSearching.value = true

    if (!input || input == '') return

    await Promise.all(Object.values(providers).map(async (item) => {
        if (!item.enabled) return
        const module = item.id
        const moduleValue = modules.value.findIndex((e) => e.id == module)
        if (!modules.value[moduleValue]) return

        let shouldFetch: boolean = false
        const key = `${module}-last-search`
        const cached = sessionStorage.getItem(key)

        if (modules.value[moduleValue].data.length !== 0) {
            modules.value[moduleValue].data = []
        }

        if (cached) {
            const { data, fetchedAt, searched } = JSON.parse(cached)
            const expiration = new Date(fetchedAt)
            expiration.setTime(expiration.getTime() + 1000 * 1000)

            if (searched !== input || expiration.getTime() < Date.now()) {
                shouldFetch = true
            } else {
                if (data.data.length !== 0) modules.value[moduleValue].data = data.data
                modules.value[moduleValue].loading = false
                return
            }
        } else if (!cached) {
            shouldFetch = true
        }

        if (!shouldFetch) return

        const response = await $fetch<{ search: SearchData }>(`${config.public.apiBase}/api/search`, {
            query: { title: input, module: module, mature }
        })

        sessionStorage.setItem(key, JSON.stringify({ data: response.search, fetchedAt: new Date(), searched: input }))

        if (response?.search.data.length !== 0)
            modules.value[moduleValue].data = response?.search.data

        modules.value[moduleValue].loading = false
    }))

    isSearching.value = false
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

const selectedData = (r: string | undefined, pageId: string, index: number) => {
    const str = String(r)
    const page = selected.value[pageId]
    if (!page) return

    console.log(page)

    page[index] = page[index] !== undefined ? undefined : str
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
                <div class="carousel" v-for="page in modules"
                    :style="` ${page.data.length === 0 ? '' : 'border-top: 1px #fff solid;'}`">
                    <Loading v-if="page.loading && isSearching" scale="scale(100%)" :search="true" />
                    <div class="prefix" v-if="!page.loading && page.data.length != 0">
                        <img :src="page.icon" class="icon">
                        <div>{{ page.name }}</div>
                    </div>
                    <div class="wrapper" v-if="page.data.length !== 0">
                        <div class="card" v-for="(item, index) in page.data"
                            :class="{ selected: selected[page.id]?.[index] == `${item.link}` }"
                            @click="selectedData(item.link, page.id, index)">
                            <NuxtImg :src="item.cover" width="336" height="478" />
                            <div class="tags" v-if="item.tag">
                                <div>{{ item.tag }}</div>
                            </div>
                            <div class="tag" id="single" v-if="!item.isSeries && ['az', 'az-j'].includes(page.id)">
                                Single</div>
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
                padding-top: 5px;
                height: fit-content;

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

                        .tags {
                            display: flex;
                            color: #fff;
                            font-weight: 600;
                            text-align: center;

                            div {
                                margin: 0 auto;
                            }
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