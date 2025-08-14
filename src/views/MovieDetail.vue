<template>
  <div v-if="m">
    <div class="row g-3">
      <div class="col-md-4">
        <img :src="m.poster" class="img-fluid rounded" :alt="m.title"/>
      </div>

      <div class="col-md-8">
        <div class="d-flex align-items-start justify-content-between">
          <div>
            <h2 class="mb-1">{{ m.title }}</h2>
            <p class="text-muted mb-2">
              {{ m.year }} • ⭐ {{ avgStars || m.rating || 'N/A' }}
              <small class="text-muted">({{ ratingsCount }} đánh giá)</small>
            </p>
          </div>

          <!-- Theo dõi -->
          <button
            class="btn btn-sm"
            :class="isFollow ? 'btn-outline-warning' : 'btn-warning'"
            @click="toggleFollow"
          >
            {{ isFollow ? 'Đang theo dõi' : 'Theo dõi' }}
          </button>
        </div>

        <!-- Đánh giá sao -->
        <div class="mb-3">
          <span class="me-2">Đánh giá của bạn:</span>
          <button
            v-for="s in 5" :key="s"
            class="btn btn-sm me-1"
            :class="s <= userStars ? 'btn-primary' : 'btn-outline-primary'"
            @click="setStars(s)"
          >
            {{ s }}★
          </button>
        </div>

        <div class="mb-2 d-flex flex-wrap gap-1">
          <span v-for="g in (m.genres||[])" :key="g" class="badge badge-genre">{{ g }}</span>
        </div>

        <p>{{ m.description }}</p>

        <div class="d-flex gap-2">
          <a v-if="m.trailerUrl" class="btn btn-outline-primary" :href="m.trailerUrl" target="_blank">Trailer</a>
          <a v-if="m.streamUrl" class="btn btn-primary" :href="m.streamUrl" target="_blank">Xem ngay</a>
        </div>
      </div>
    </div>

    <!-- Chỉ 1 iframe: ưu tiên stream, fallback trailer -->
    <div v-if="playerUrl" class="mt-4 ratio ratio-16x9">
      <iframe
        :src="playerUrl"
        allowfullscreen
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>

    <!-- Bình luận -->
    <Comments :movie-id="m.id" />
  </div>
  <div v-else class="text-muted">Đang tải...</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LocalAPI } from '../services/localData'
import { toEmbed } from '../utils/embed'
import { Social } from '../services/social'
import Comments from '../components/Comments.vue' // ✅ Phải import thì mới render

const route = useRoute()

const m = ref(null)

// ===== Player (chỉ 1 iframe) =====
const embedTrailer = computed(() => {
  const u = toEmbed(m.value?.trailerUrl || '')
  return u && u.length ? u : null
})
const embedStream = computed(() => {
  const u = toEmbed(m.value?.streamUrl || '')
  return u && u.length ? u : null
})
const playerUrl = computed(() => embedStream.value || embedTrailer.value || null)

// ===== Social states (reactive) =====
const isFollow = ref(false)      // ✅ trùng tên với template
const userStars = ref(0)
const avgStars = ref(0)
const ratingsCount = ref(0)

function refreshSocial() {
  if (!m.value) return
  isFollow.value     = Social.isFollow(m.value.id)
  userStars.value    = Social.getUserStars(m.value.id)
  avgStars.value     = Social.getAvgStars(m.value.id)
  ratingsCount.value = Social.getRatingsCount(m.value.id)
}

function toggleFollow() {
  if (!m.value) return
  try {
    Social.toggleFollow(m.value.id) // thường là sync (localStorage)
    refreshSocial()
  } catch (e) {
    alert(e?.message || 'Bạn cần đăng nhập.')
  }
}

function setStars(s) {
  if (!m.value) return
  try {
    Social.setStars(m.value.id, s) // thường là sync
    refreshSocial()
  } catch (e) {
    alert(e?.message || 'Bạn cần đăng nhập.')
  }
}

async function load() {
  // nếu id là số trong LocalAPI thì parseInt, còn nếu là string thì để nguyên
  const id = route.params.id
  m.value = await LocalAPI.getMovie(isNaN(id) ? id : Number(id))
  refreshSocial()
}
load()

// Nếu đổi route (xem phim khác) thì nạp lại
watch(() => route.params.id, load)
</script>
