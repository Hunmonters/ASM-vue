<template>
  <div class="card h-100 border-0 shadow-sm">
    <img v-if="movie.poster" :src="movie.poster" class="card-img-top" :alt="movie.title" style="object-fit:cover;aspect-ratio:2/3;border-bottom:1px solid #1f2a36"/>
    <div class="card-body d-flex flex-column">
      <h6 class="mb-1">{{ movie.title }}</h6>
      <small class="text-muted">{{ movie.year }} • ⭐ {{ movie.rating || 'N/A' }}</small>
      <div class="mt-2 d-flex flex-wrap gap-1">
        <span v-for="g in (movie.genres||[])" :key="g" class="badge badge-genre">{{ g }}</span>
      </div>
      <router-link class="btn btn-primary btn-sm mt-auto" :to="{ name: 'movie', params: { id: movie.id } }">Chi tiết</router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({ movie: { type: Object, required: true } });
</script>