<script setup lang="ts">

const page_data = ref<any[]>([])
const selected = reactive<any[]>([])

const keyPressed = async (e: KeyboardEvent, inputValue) => {
    if (e.code == 'Enter') {
        page_data.value = []

        const data = await useFetch('/api/search', {
            query: {
                title: inputValue
            }
        })

        page_data.value = data.data.value?.search
    }
}

const openPage = () => {
    const router = useRouter()
    const e = selected.join('&')
    router.push({ path: '/download', query: { data: e } })
}

const selectedData = (r, index) => {
    if (selected[index]) {
        selected.splice(index, 1)
    } else {
        selected[index] = r
    }
}

</script>

<template>
    <div class="section">
        <input type="text" @keypress="keyPressed($event, $event.target?.value)">
        <div class="options">
            <div class="carousel" v-for="page in page_data">
                <div class="prefix">{{ page.name }}</div>
                <div class="wrapper">
                    <div class="card" v-for="(item, index) in page.data"
                        :class="`${selected[index] === `${page.id}=${item.link}` ? 'selected' : ''}`"
                        @click="(e) => { selectedData(`${page.id}=${item.link}`, index) }">
                        <NuxtImg :src="item.cover" width="336" height="478" />

                        <div class="tag">{{ item.tag }}</div>
                        <div>{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="truffle">
            <div class="button" @click="openPage(selected)">Open</div>
        </div>
    </div>
</template>

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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.carousel {
    width: 100vw;
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
    z-index: 1;
    margin: 2px;
    width: 180px;
    height: 360px;
    overflow: hidden;
    position: relative;
    background-color: #070307;
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
    width: 10%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: black;
    padding: 10px;
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
