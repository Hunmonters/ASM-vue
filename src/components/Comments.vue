<!-- src/components/Comments.vue -->
<template>
  <div class="card mt-4">
    <div class="card-body">
      <h5 class="mb-3">Bình luận</h5>

      <!-- Form: chỉ cần 1 trong 2, mình dùng form để Enter gửi luôn -->
      <form class="mb-3" @submit.prevent="addComment">
        <textarea
          v-model.trim="text"
          class="form-control"
          rows="2"
          placeholder="Viết bình luận..."
        ></textarea>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <small class="text-muted" v-if="!user">
            Vui lòng <router-link to="/login">đăng nhập</router-link> để bình luận.
          </small>
          <button class="btn btn-primary ms-auto" type="submit" :disabled="!text">Gửi</button>
        </div>
      </form>

      <!-- Danh sách bình luận -->
      <div v-if="items.length === 0" class="text-muted">Chưa có bình luận nào.</div>
      <ul v-else class="list-unstyled mb-0">
        <li v-for="c in items" :key="c.id" class="mb-3">
          <div class="d-flex gap-2">
            <img
              :src="c.avatar || 'https://via.placeholder.com/40x40'"
              width="40"
              height="40"
              class="rounded"
              alt="avatar"
            />
            <div>
              <div class="small text-muted">
                <strong class="text-light">{{ c.name }}</strong>
                • {{ formatTime(c.createdAt) }}
              </div>
              <div>{{ c.text }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  movieId: { type: [String, Number], required: true }
})

function storageKey(id) {
  return `app_comments_${id}`
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('app_user_session') || 'null')
  } catch {
    return null
  }
}

const user = getUser()
const text = ref('')
const items = ref([])

function load() {
  try {
    const raw = localStorage.getItem(storageKey(props.movieId))
    items.value = raw ? JSON.parse(raw) : []
  } catch {
    items.value = []
  }
}
function save() {
  localStorage.setItem(storageKey(props.movieId), JSON.stringify(items.value))
}

function addComment() {
  if (!text.value) return
  const u = getUser()
  if (!u) {
    alert('Bạn cần đăng nhập để bình luận.')
    return
  }
  const c = {
    id: Date.now(),
    userId: u.id,
    name: u.name || 'Người dùng',
    avatar: u.avatar || '',
    text: text.value,
    createdAt: new Date().toISOString()
  }
  items.value.unshift(c)
  text.value = ''
  save()
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

onMounted(load)
// nếu movieId thay đổi (đi tới phim khác) thì nạp lại
watch(() => props.movieId, load)
</script>

<style scoped>
.card {
  background-color: #141a21;
  color: #dbe2ea;
  border: 1px solid #1f2a36;
}
.form-control {
  background-color: #0f141a;
  color: #dbe2ea;
  border-color: #26303b;
}
</style>
