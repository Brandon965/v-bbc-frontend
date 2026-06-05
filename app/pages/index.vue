{ "id": "rb", "enabled": true },
<script setup lang="ts">
import { useConfig } from '~/composables/config'

const router = useRouter()

const keyPressed = async (event: KeyboardEvent) => {
    if (event.code == 'Enter') {
        router.push({ path: '/search', query: { search: event.target?.value } })
    }
}

onMounted(() => {
    if (import.meta.client) {
        useConfig()
    }
})

</script>

<template>
    <div class="section">
        <input type="text" @keypress="keyPressed($event)">
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
</style>
