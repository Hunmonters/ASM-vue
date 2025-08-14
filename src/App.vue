<template>
  <div class="bg-dark text-light min-vh-100">
    <NavBar />
    <main class="container py-4">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<style>
html, body, #app { height: 100%; background: #0b0f14; }
.card { background-color: #141a21; color: #dbe2ea; }
.form-control, .form-select { background-color: #0f141a; color: #dbe2ea; border-color: #26303b; }
.form-control::placeholder { color: #7f8b98; }
.input-group-text { background-color: #0f141a; color: #95a4b3; border-color: #26303b; }
.btn-primary { background-color: #1e88e5; border-color: #1976d2; }
.btn-outline-primary { color: #90caf9; border-color: #1976d2; }
.navbar-dark .navbar-nav .nav-link.active { color: #90caf9; }
.badge-genre { background:#223042; color:#cfe5ff; }
</style>