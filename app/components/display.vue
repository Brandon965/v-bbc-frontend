<script setup lang="ts">
const router = useRouter()
</script>

<template>
    <div class="display">
        <div class="back" @click="router.back()"><</div>
        <div class="site-title">V-Big Book Covers</div>
    </div>
</template>

<style>
.display {
    width: 100%;
    color: #fff;
    padding: 10px;
    display: flex;
    font-size: 22px;
    font-weight: 600;
    flex-direction: row;
}

.display .site-title {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}
</style>
