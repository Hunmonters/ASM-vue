<template>
  <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
    <h4 class="mb-0">{{ title }}</h4>
    <div class="d-flex flex-wrap gap-2">
      <div class="input-group w-auto">
        <span class="input-group-text">Tìm</span>
        <input v-model.trim="q" @keyup.enter="apply" class="form-control" placeholder="Tên phim..."/>
        <button class="btn btn-outline-primary" @click="apply">Lọc</button>
      </div>
      <select v-model="genre" class="form-select w-auto" @change="apply">
        <option value="">Tất cả thể loại</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-6 col-md-3 col-lg-2" v-for="m in movies" :key="m.id">
      <MovieCard :movie="m"/>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import { LocalAPI } from '../services/localData'

const route  = useRoute()
const movies = ref([])
const genres = ref([])
const q      = ref('')
const genre  = ref('')

const tab = computed(function(){
  return (route.query && route.query.tab ? String(route.query.tab) : '')
})

const title = computed(function(){
  switch(tab.value){
    case 'dang-chieu':   return 'Đang chiếu'
    case 'danh-gia-cao': return 'Đánh giá cao'
    case 'lich-chieu':   return 'Lịch chiếu'
    case 'phim-le':      return 'Phim lẻ'
    case 'top-10':       return 'Top 10'
    default:             return 'Tất cả phim'
  }
})

async function load(){
  // mapping tiêu chí
  var sort = 'updatedAt', order = 'desc', limit = 60
  if (tab.value === 'danh-gia-cao') { sort = 'rating';   order = 'desc' }
  else if (tab.value === 'lich-chieu'){ sort = 'year';     order = 'desc' }
  else if (tab.value === 'phim-le')   { sort = 'year';     order = 'desc' }
  else if (tab.value === 'top-10')    { sort = 'rating';   order = 'desc'; limit = 10 }
  // default & 'dang-chieu' => updatedAt desc (mới cập nhật)

  movies.value = await LocalAPI.getMovies({
    q: q.value, genre: genre.value, sort: sort, order: order, limit: limit
  })
}
function apply(){ load() }

async function loadGenres(){
  genres.value = await LocalAPI.getGenres()
}

function onDbChanged(){ load(); loadGenres() }

onMounted(function(){
  loadGenres()
  load()
  window.addEventListener('db:changed', onDbChanged)
})
onBeforeUnmount(function(){
  window.removeEventListener('db:changed', onDbChanged)
})

// đổi tab -> reload
watch(() => route.query && route.query.tab, function(){ load() })
</script>
