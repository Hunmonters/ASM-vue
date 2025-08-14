<template>
  <!-- Hero -->
  <div id="hero" class="carousel slide mb-4" data-bs-ride="carousel">
    <div class="carousel-inner rounded" style="border:1px solid #1f2a36">
      <div v-for="(b, i) in banners" :key="b.id" :class="['carousel-item', { active: i===0 }]">
        <img :src="b.image" class="d-block w-100" :alt="b.title" style="object-fit:cover;max-height:520px">
        <div class="carousel-caption text-start">
          <h2 class="fw-bold">{{ b.title }}</h2>
          <p class="mb-3">{{ b.tagline }}</p>
          <div class="d-flex gap-2">
            <router-link v-if="b.toId" class="btn btn-danger" :to="{ name: 'movie', params: { id: b.toId } }">Xem Phim</router-link>
            <button v-else class="btn btn-danger" disabled>Xem Phim</button>
            <router-link v-if="b.toId" class="btn btn-outline-light" :to="{ name: 'movie', params: { id: b.toId } }">Chi Tiết</router-link>
            <button v-else class="btn btn-outline-light" disabled>Chi Tiết</button>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#hero" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#hero" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <!-- ĐANG THỊNH HÀNH -->
  <section class="mb-4">
    <div class="d-flex align-items-center mb-2">
      <h4 class="mb-0 me-3">ĐANG THỊNH HÀNH</h4>
      <div class="flex-grow-1 border-bottom" style="border-color:#26303b!important"></div>
    </div>
    <div class="row g-3">
      <div class="col-6 col-md-3 col-lg-2" v-for="m in hot" :key="m.id">
        <MovieCard :movie="m" />
      </div>
    </div>
  </section>

  <!-- MỚI CẬP NHẬT -->
  <section class="mb-4">
    <div class="d-flex align-items-center mb-2">
      <h4 class="mb-0 me-3">MỚI CẬP NHẬT</h4>
      <small class="text-muted">Danh sách cập nhật theo lần chỉnh sửa gần nhất</small>
      <div class="flex-grow-1 border-bottom ms-2" style="border-color:#26303b!important"></div>
    </div>
    <div class="row g-3">
      <div class="col-6 col-md-3 col-lg-2" v-for="m in latest" :key="m.id">
        <MovieCard :movie="m" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { LocalAPI } from '../services/localData'

const banners = [
  { id: 1, title: 'Phàm Nhân Tu Tiên', tagline: 'Huyền huyễn • 2024', toId: 1, image: 'https://phimhoathinh3d.me/wp-content/uploads/2025/06/fe09a10062768cca301682eba6c8245b-scaled.jpg' },
  { id: 2, title: 'Đấu La Đại Lục',   tagline: 'Hành động • 2023',   toId: 2, image: 'https://phimhoathinh3d.me/wp-content/uploads/2025/06/b33f409a503b9d7af4967e3e91d0c2a8.jpg' },
  { id: 3, title: 'Mục Thần Ký',      tagline: 'Phiêu lưu • 2022',   toId: 3, image: 'https://phimhoathinh3d.me/wp-content/uploads/2025/06/79ad9da402005ec184aa14bd1f781d05.jpg' },
  { id: 4, title: 'Tiên Nghịch',      tagline: 'Huyền huyễn • 2024', toId: 4, image: 'https://phimhoathinh3d.me/wp-content/uploads/2025/06/290650828b2ef3b9e4a63ce422a5919a-1-scaled.jpg' }
]

const hot = ref([])
const latest = ref([])

async function load() {
  hot.value    = await LocalAPI.getMovies({ sort: 'views',     order: 'desc', limit: 12 })
  latest.value = await LocalAPI.getMovies({ sort: 'updatedAt', order: 'desc', limit: 24 })
}

function onDbChanged(){ load() }

onMounted(() => {
  load()
  window.addEventListener('db:changed', onDbChanged)
})
onBeforeUnmount(() => window.removeEventListener('db:changed', onDbChanged))
</script>
