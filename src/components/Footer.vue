<template>
    <footer class="mt-5 py-4" style="background:#0f141a;border-top:1px solid #1f2a36">
        <div class="container d-flex flex-wrap align-items-center gap-3 justify-content-between">
            <div class="d-flex align-items-center">
                <img src="../assets/OIP.webp" alt="MovieHub Logo" style="height:32px;width:32px;margin-right:10px;" />
                <div>
                    <strong>🎬 MovieHub</strong>
                    <small class="text-muted ms-2">— Xem phim nền tối • học tập</small>
                </div>
            </div>
            <div class="text-muted small text-end">
                © {{ currentYear }} MovieHub.<br>
                <span>Demo for education.</span>
                <a href="https://github.com/" target="_blank" class="ms-2 text-decoration-none text-info">GitHub</a>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear())
</script>
