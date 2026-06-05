<script setup lang="ts">
import Settings from '../assets/settings.svg'

const router = useRouter()


</script>

<template>
    <div class="display">
        <div class="back" @click="router.back()"><</div>
        <div class="site-title">Big World Covers</div>
        <img class="settings" :src="Settings" />
    </div>
</template>

<style>
.display {
    color: #fff;
    padding: 10px;
    display: flex;
    font-size: 22px;
    font-weight: 600;
    flex-direction: row;
    position: fixed;
    width: calc(100% - 60px);
    z-index: 3;
    background-color: #ea98ff13;
    backdrop-filter: blur(50px);
}

.display .back {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.display .site-title {
    margin-left: auto;
    text-align: center;
}

.display .settings {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-left: auto;
    filter: invert();
}
</style>
