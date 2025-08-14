<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background:#0f141a;border-bottom:1px solid #1f2a36">
    <div class="container">
      <img src="../assets/OIP.webp" alt="MovieHub Logo" style="height:100px;width:100px;margin-right:10px;border-radius: 17px;" />
      <router-link class="navbar-brand fw-bold" to="/">MovieHub</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/browse">Tất cả</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/dang-chieu">Đang chiếu</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/danh-gia-cao">Đánh giá cao</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/lich-chieu">Lịch chiếu</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/phim-le">Phim lẻ</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/top-10">Top 10</router-link></li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <template v-if="isAuthed">
            <li class="nav-item"><router-link class="nav-link" to="/profile">Trang cá nhân</router-link></li>
            <li class="nav-item"><button class="btn btn-sm btn-outline-light ms-2" @click="onLogout">Đăng xuất</button></li>
          </template>
          <template v-else>
            <li class="nav-item"><router-link class="nav-link" to="/login">Đăng nhập</router-link></li>
            <li class="nav-item"><router-link class="btn btn-sm btn-primary ms-2" to="/register">Đăng ký</router-link></li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
const isAuthed = computed(() => !!localStorage.getItem('app_user_session'));
function onLogout(){ localStorage.removeItem('app_user_session'); window.location.href = '/'; }
</script>
