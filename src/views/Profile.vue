<template>
  <div v-if="u" class="mb-5">
    <!-- COVER -->
    <div
      class="position-relative rounded-3 overflow-hidden mb-3 cover-wrap"
      @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
      @touchstart.prevent="startDrag" @touchmove.prevent="onDrag" @touchend="endDrag"
    >
      <template v-if="u.cover">
        <img :src="u.cover" class="w-100 h-100 cover-img" :style="coverStyle" alt="" />
      </template>
      <template v-else>
        <div class="w-100 h-100 d-flex align-items-center justify-content-center cover-empty">
          <i class="bi bi-image fs-1 text-muted"></i>
        </div>
      </template>

      <!-- Bánh răng: menu chỉnh ảnh bìa -->
      <div class="position-absolute end-0 top-0 m-2 dropdown">
        <button class="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-expanded="false" title="Chỉnh ảnh bìa">
          <i class="bi bi-gear"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><button class="dropdown-item" @click="pickImage('cover')"><i class="bi bi-upload me-2"></i>Đổi ảnh bìa</button></li>
          <li><button class="dropdown-item text-danger" :disabled="!u.cover" @click="removeCover"><i class="bi bi-trash me-2"></i>Xoá ảnh bìa</button></li>
        </ul>
      </div>
    </div>

    <!-- Header: AVATAR + tên + stats -->
    <div class="profile-head d-flex align-items-center justify-content-between mb-3 flex-wrap" style="gap:16px;">
      <div class="d-flex align-items-center gap-3">
        <div class="avatar-wrap">
          <template v-if="u.avatar">
            <img :src="u.avatar" class="avatar-img" alt="avatar" />
          </template>
          <template v-else>
            <div class="avatar-empty d-flex align-items-center justify-content-center">
              <i class="bi bi-person fs-3 text-muted"></i>
            </div>
          </template>

          <!-- bánh răng avatar -->
          <div class="dropdown">
            <button class="btn btn-light btn-sm avatar-btn rounded-circle shadow-sm" data-bs-toggle="dropdown" aria-expanded="false" title="Chỉnh avatar">
              <i class="bi bi-gear"></i>
            </button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item" @click="pickImage('avatar')"><i class="bi bi-upload me-2"></i>Đổi avatar</button></li>
              <li><button class="dropdown-item text-danger" :disabled="!u.avatar" @click="removeAvatar"><i class="bi bi-trash me-2"></i>Xoá avatar</button></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 class="mb-0">{{ u.name || u.email }}</h4>
          <small class="text-muted">{{ u.rank || 'Phàm Nhân' }}</small>
        </div>
      </div>

      <div class="d-flex gap-3">
        <div class="stat-pill text-center">
          <div class="stat-num">{{ u.stats?.tuvi ?? 0 }}</div>
          <div class="stat-label">Tu Vi</div>
        </div>
        <div class="stat-pill text-center">
          <div class="stat-num">{{ u.stats?.tinhthach ?? 0 }}</div>
          <div class="stat-label">Tinh Thạch</div>
        </div>
        <div class="stat-pill text-center">
          <div class="stat-num">{{ u.stats?.tienngoc ?? 0 }}</div>
          <div class="stat-label">Tiên Ngọc</div>
        </div>
      </div>
    </div>

    <!-- file picker ẩn -->
    <input ref="filePicker" type="file" accept="image/*" class="d-none" @change="onPickImage" />

    <!-- ADMIN (chỉ admin mới thấy) -->
    <div v-if="isAdmin" class="card border-warning mb-3">
      <div class="card-body">
        <h6 class="text-warning mb-3"><i class="bi bi-shield-lock me-2"></i>Khu vực Admin</h6>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm btn-outline-warning" @click="goAdmin('movies')"><i class="bi bi-plus-circle me-2"></i>Thêm phim</button>
          <button class="btn btn-sm btn-outline-warning" @click="goAdmin('pages')"><i class="bi bi-pencil-square me-2"></i>Sửa trang</button>
          <button class="btn btn-sm btn-outline-warning" @click="goAdmin('users')"><i class="bi bi-people me-2"></i>Quản lý người dùng</button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-pills mb-3">
      <li class="nav-item"><button class="nav-link" :class="{active: tab==='info'}" @click="tab='info'">Thông tin</button></li>
      <li class="nav-item"><button class="nav-link" :class="{active: tab==='follows'}" @click="tab='follows'">Đang theo dõi</button></li>
      <li class="nav-item"><button class="nav-link" :class="{active: tab==='ratings'}" @click="tab='ratings'">Đánh giá</button></li>
    </ul>

    <!-- Tab: Thông tin -->
    <div v-show="tab==='info'">
      <div class="card">
        <div class="card-body">
          <template v-if="!editInfoMode">
            <div class="mb-2"><strong>Tên hiển thị:</strong> {{ u.name || '—' }}</div>
            <div class="mb-2"><strong>Email:</strong> {{ u.email || '—' }}</div>
            <button class="btn btn-sm btn-outline-primary" @click="editInfoMode=true">Chỉnh sửa thông tin</button>
          </template>
          <template v-else>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Tên hiển thị</label>
                <input v-model="form.name" class="form-control form-control-sm" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" class="form-control form-control-sm" />
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-sm btn-primary" @click="saveInfo">Lưu</button>
              <button class="btn btn-sm btn-outline-secondary" @click="cancelInfo">Huỷ</button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Tab: Đang theo dõi -->
    <div v-show="tab==='follows'">
      <h6 class="mb-3">Phim đang theo dõi</h6>
      <div v-if="loadingFollows" class="text-muted">Đang tải...</div>
      <div v-else-if="followedMovies.length===0" class="text-muted">Bạn chưa theo dõi phim nào.</div>
      <div v-else class="row g-3">
        <div class="col-6 col-md-3" v-for="mv in followedMovies" :key="mv.id">
          <div class="card h-100">
            <img :src="mv.poster" class="card-img-top" :alt="mv.title">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title mb-1">{{ mv.title }}</h6>
              <small class="text-muted mb-2">{{ mv.year }}</small>
              <div class="mt-auto d-flex gap-2">
                <router-link class="btn btn-sm btn-primary" :to="`/movie/${mv.id}`">Xem</router-link>
                <button class="btn btn-sm btn-outline-danger" @click="unfollow(mv.id)">Bỏ theo dõi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Đánh giá -->
    <div v-show="tab==='ratings'">
      <h6 class="mb-3">Phim bạn đã đánh giá</h6>
      <div v-if="loadingRatings" class="text-muted">Đang tải...</div>
      <div v-else-if="ratedMovies.length===0" class="text-muted">Bạn chưa đánh giá phim nào.</div>
      <div v-else class="row g-3">
        <div class="col-6 col-md-3" v-for="item in ratedMovies" :key="item.mv.id">
          <div class="card h-100">
            <img :src="item.mv.poster" class="card-img-top" :alt="item.mv.title">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title mb-1">{{ item.mv.title }}</h6>
              <small class="text-muted">Bạn chấm: {{ item.stars }}★</small>
              <small class="text-muted">TB: {{ item.avg || 0 }}★ ({{ item.count }} lượt)</small>
              <router-link class="btn btn-sm btn-primary mt-auto" :to="`/movie/${item.mv.id}`">Xem</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div v-else class="text-center py-5">
    <p class="text-muted mb-3">Bạn chưa đăng nhập</p>
    <router-link to="/login" class="btn btn-outline-light">Đăng nhập</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Auth } from '../services/auth'
import { Social } from '../services/social'
import { LocalAPI } from '../services/localData'
import { DB } from '../services/db'

const router = useRouter()

// user
const u = ref(Auth.get())
if (!u.value) router.replace({ name: 'login', query: { redirect: '/profile' } })
if (!u.value?.stats) u.value = { ...u.value, stats: { tuvi: 0, tinhthach: 0, tienngoc: 0 } }

// GHI DB + CẬP NHẬT SESSION
function applyUpdate(patch){
  const current = DB.getUserByNameOrEmail(u.value.email) || u.value
  const next = { ...current, ...patch }
  DB.upsertUser(next)
  Auth.set(next)
  u.value = next
  return next
}

// tabs & form
const tab = ref('info')
const editInfoMode = ref(false)
const form = ref({ name: u.value?.name || '', email: u.value?.email || '' })

// cover controls
const dragging = ref(false), startY = ref(0), startPos = ref(50)
const coverPos = ref(u.value?.coverPos ?? 50)
const coverZoom = ref(u.value?.coverZoom ?? 1)
const coverStyle = computed(() => ({ objectFit: 'cover', objectPosition: `50% ${coverPos.value}%`, transform: `scale(${coverZoom.value})` }))

function startDrag(ev){ dragging.value = true; startY.value = getY(ev); startPos.value = coverPos.value }
function onDrag(ev){ if(!dragging.value) return; const dy = getY(ev) - startY.value; const delta = (dy/240)*100; coverPos.value = clamp(startPos.value + delta, 0, 100) }
function endDrag(){ if(!dragging.value) return; dragging.value = false; applyUpdate({ coverPos: coverPos.value, coverZoom: coverZoom.value }) }
function getY(ev){ return (ev.touches?.[0]?.clientY) ?? ev.clientY }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)) }

// gear menus + file picker
const filePicker = ref(null)
const imageType = ref(null)
function pickImage(type){ imageType.value = type; filePicker.value?.click() }
function setBlackCover(){ removeCover() }
function setBlackAvatar(){ removeAvatar() }
function removeCover(){ applyUpdate({ cover: null }) }
function removeAvatar(){ applyUpdate({ avatar: null }) }

// nén ảnh trước khi lưu
async function onPickImage(e){
  const f = e.target.files?.[0]; if(!f) return
  if(!f.type.startsWith('image/')) return alert('Vui lòng chọn ảnh.')
  const isAvatar = imageType.value === 'avatar'
  const maxW = isAvatar ? 320 : 1600
  const maxH = isAvatar ? 320 : 900
  const quality = isAvatar ? 0.9 : 0.82
  const dataUrl = await compressImageToDataURL(f, maxW, maxH, quality)
  applyUpdate({ [imageType.value]: dataUrl })
  e.target.value = ''
}

async function compressImageToDataURL(file, maxW, maxH, quality=0.85){
  const bitmap = await createImageBitmap(file)
  const ratio = Math.min(maxW/bitmap.width, maxH/bitmap.height, 1)
  const w = Math.round(bitmap.width * ratio), h = Math.round(bitmap.height * ratio)
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', quality)
}

// info form
function saveInfo(){
  const name = form.value.name.trim()
  const email = form.value.email.trim().toLowerCase()
  if (!name || !email) return alert('Vui lòng nhập tên và email')
  applyUpdate({ name, email })
  editInfoMode.value = false
}
function cancelInfo(){
  form.value = { name: u.value?.name || '', email: u.value?.email || '' }
  editInfoMode.value = false
}

// follows
const loadingFollows = ref(false), followedMovies = ref([])
async function loadFollows(){
  loadingFollows.value = true
  const ids = Social.getFollowIds(Auth.userId())
  const list = []
  for (const id of ids){
    const mv = await LocalAPI.getMovie(isNaN(id)?id:Number(id))
    if (mv) list.push(mv)
  }
  followedMovies.value = list
  loadingFollows.value = false
}
function unfollow(id){ Social.toggleFollow(id, Auth.userId()); loadFollows() }

// ratings
const loadingRatings = ref(false), ratedMovies = ref([])
async function loadRatings(){
  loadingRatings.value = true
  const ids = Social.getRatedIds(Auth.userId())
  const list = []
  for (const id of ids){
    const mv = await LocalAPI.getMovie(isNaN(id)?id:Number(id))
    if (!mv) continue
    list.push({ mv, stars: Social.getUserStars(id, Auth.userId()), avg: Social.getAvgStars(id), count: Social.getRatingsCount(id) })
  }
  ratedMovies.value = list
  loadingRatings.value = false
}

// switch tab
onMounted(() => {
  if (tab.value==='follows') loadFollows()
  if (tab.value==='ratings') loadRatings()
})
watch(() => tab.value, (t) => {
  if (t==='follows') loadFollows()
  if (t==='ratings') loadRatings()
})

// sync user realtime
function onAuthChanged(e){ u.value = e.detail || Auth.get() }
function onStorage(e){ if (e.key === Auth.key) u.value = Auth.get() }
function onDbChanged(){ // lấy bản mới nhất trong DB
  const latest = DB.listUsers().find(x => String(x.id) === String(u.value?.id))
  if (latest) u.value = latest
}
onMounted(() => {
  window.addEventListener('auth:changed', onAuthChanged)
  window.addEventListener('storage', onStorage)
  window.addEventListener('db:changed', onDbChanged)
})
onBeforeUnmount(() => {
  window.removeEventListener('auth:changed', onAuthChanged)
  window.removeEventListener('storage', onStorage)
  window.removeEventListener('db:changed', onDbChanged)
})

// admin shortcuts
const isAdmin = computed(() => (u.value?.roles || []).includes('admin') || !!u.value?.isAdmin)
function goAdmin(section){
  router.push({ path: '/admin', query: { tab: section } })
}
</script>


<style scoped>
.cover-wrap { height: 360px; background:#000; border:1px solid rgba(255,255,255,.08); }
.cover-img  { width:100%; height:100%; user-select:none; -webkit-user-drag:none; cursor:grab; }
.cover-img:active { cursor:grabbing; }
.cover-empty { background:#000; }

.profile-head { margin-top: 8px; }

.avatar-wrap { position: relative; width: 96px; height: 96px; }
.avatar-img  { width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid #1f1f1f; background:#000; }
.avatar-empty{ width:100%; height:100%; border-radius:50%; border:3px solid #1f1f1f; background:#000; }
.avatar-btn  { position:absolute; right:-6px; bottom:-6px; width:36px; height:36px; z-index:3; }

.stat-pill { min-width: 92px; padding: 8px 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; }
.stat-num { font-weight: 700; line-height: 1; font-size: 18px; }
.stat-label { font-size: 12px; color: #9aa0a6; }
</style>
