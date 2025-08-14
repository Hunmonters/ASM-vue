<template>
  <div class="container py-4">
    <h3 class="mb-4 d-flex align-items-center gap-2">
      <i class="bi bi-shield-lock"></i> Khu vực Admin
    </h3>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{active: tab==='movies'}" @click="tab='movies'">Phim</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{active: tab==='pages'}" @click="tab='pages'">Trang</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{active: tab==='users'}" @click="tab='users'">Người dùng</button>
      </li>
    </ul>

    <!-- MOVIES -->
    <div v-show="tab==='movies'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Quản lý phim</h5>
        <button class="btn btn-primary btn-sm" @click="openMovie()">
          <i class="bi bi-plus-lg me-1"></i>Thêm phim
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-dark table-striped align-middle">
          <thead>
            <tr><th>Poster</th><th>Tiêu đề</th><th>Năm</th><th>Thể loại</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            <tr v-for="m in movies" :key="m.id">
              <td style="width:80px">
                <img :src="m.poster" class="img-fluid rounded" alt="" />
              </td>
              <td>{{ m.title }}</td>
              <td style="width:90px">{{ m.year }}</td>
              <td>{{ (m.genres||[]).join(', ') }}</td>
              <td style="width:180px">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-light" @click="openMovie(m)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="delMovie(m.id)">Xoá</button>
                </div>
              </td>
            </tr>
            <tr v-if="movies.length===0">
              <td colspan="5" class="text-muted text-center">Chưa có phim.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGES -->
    <div v-show="tab==='pages'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Quản lý trang</h5>
        <button class="btn btn-primary btn-sm" @click="openPage()">
          <i class="bi bi-plus-lg me-1"></i>Thêm trang
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-dark table-striped align-middle">
          <thead>
            <tr><th>Slug</th><th>Tiêu đề</th><th>Cập nhật</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in pages" :key="p.id">
              <td>{{ p.slug }}</td>
              <td>{{ p.title }}</td>
              <td style="width:180px">{{ p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—' }}</td>
              <td style="width:180px">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-light" @click="openPage(p)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="delPage(p.id)">Xoá</button>
                </div>
              </td>
            </tr>
            <tr v-if="pages.length===0">
              <td colspan="4" class="text-muted text-center">Chưa có trang.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- USERS -->
    <div v-show="tab==='users'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Người dùng</h5>
        <button class="btn btn-primary btn-sm" @click="openUser()">
          <i class="bi bi-plus-lg me-1"></i>Thêm người dùng
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-dark table-striped align-middle">
          <thead>
            <tr><th>Tài khoản</th><th>Email</th><th>Admin</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td style="width:100px">
                <span class="badge" :class="u.isAdmin ? 'bg-success' : 'bg-secondary'">
                  {{ u.isAdmin ? 'Yes' : 'No' }}
                </span>
              </td>
              <td style="width:180px">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-light" @click="openUser(u)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="delUser(u.id)">Xoá</button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length===0">
              <td colspan="4" class="text-muted text-center">Chưa có người dùng.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODALS: markup trực tiếp -->
    <!-- Movie Modal -->
    <div v-if="showMovie" class="modal-backdrop-custom">
  <div class="modal-card bg-dark text-light p-3 rounded">
    <!-- tiêu đề -->
    <h5>{{ movieForm.id ? 'Sửa phim' : 'Thêm phim' }}</h5>
    <div class="row g-2">
      <!-- Poster -->
      <div class="col-md-12">
        <label class="form-label">Poster</label>
        <input v-model="movieForm.poster" class="form-control form-control-sm"/>
      </div>

      <!-- Tiêu đề -->
      <div class="col-md-12">
        <label class="form-label">Tiêu đề</label>
        <input v-model="movieForm.title" class="form-control form-control-sm"/>
      </div>

      <!-- Năm -->
      <div class="col-md-4">
        <label class="form-label">Năm</label>
        <input v-model="movieForm.year" class="form-control form-control-sm"/>
      </div>

      <!-- THỂ LOẠI → đổi thành genresText -->
      <div class="col-md-8">
        <label class="form-label">Thể loại</label>
        <input v-model="movieForm.genresText"
               class="form-control form-control-sm"
               placeholder="huyền huyễn, hành động, phiêu lưu" />
      </div>

      <!-- Mô tả -->
      <div class="col-md-12">
        <label class="form-label">Mô tả</label>
        <textarea v-model="movieForm.description" class="form-control form-control-sm"></textarea>
      </div>

      <!-- Trailer URL -->
      <div class="col-md-12">
        <label class="form-label">Trailer URL</label>
        <input v-model="movieForm.trailerUrl" class="form-control form-control-sm"/>
      </div>

      <!-- Stream URL -->
      <div class="col-md-12">
        <label class="form-label">Stream URL</label>
        <input v-model="movieForm.streamUrl" class="form-control form-control-sm"/>
      </div>
    </div>

    <!-- Buttons -->
    <div class="mt-3 d-flex justify-content-end gap-2">
      <button class="btn btn-sm btn-outline-secondary" @click="showMovie=false">Huỷ</button>
      <button class="btn btn-sm btn-primary" @click="saveMovie(movieForm)">Lưu</button>
    </div>
  </div>
</div>


    <!-- Page Modal -->
    <div v-if="showPage" class="modal-backdrop-custom">
      <div class="card bg-dark text-light modal-card">
        <div class="card-body">
          <h5 class="mb-3">Trang</h5>
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label">Slug</label>
              <input v-model="pageForm.slug" class="form-control form-control-sm" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Tiêu đề</label>
              <input v-model="pageForm.title" class="form-control form-control-sm" />
            </div>
            <div class="col-md-12">
              <label class="form-label">Nội dung</label>
              <textarea v-model="pageForm.content" rows="6" class="form-control form-control-sm"></textarea>
            </div>
          </div>
          <div class="mt-3 d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-secondary" @click="showPage=false">Huỷ</button>
            <button class="btn btn-sm btn-primary" @click="savePage(pageForm)">Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUser" class="modal-backdrop-custom">
      <div class="card bg-dark text-light modal-card">
        <div class="card-body">
          <h5 class="mb-3">Người dùng</h5>
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label">Tên</label>
              <input v-model="userForm.name" class="form-control form-control-sm" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model="userForm.email" class="form-control form-control-sm" />
            </div>
            <div class="col-md-12 form-check mt-2">
              <input id="adminCk" type="checkbox" class="form-check-input" v-model="userForm.isAdmin" />
              <label class="form-check-label" for="adminCk">Quản trị viên</label>
            </div>
          </div>
          <div class="mt-3 d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-secondary" @click="showUser=false">Huỷ</button>
            <button class="btn btn-sm btn-primary" @click="saveUser(userForm)">Lưu</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AdminStore } from '../services/adminStore'

/* ===== state & data ===== */
const tab = ref('movies')
const movies = ref([])
const pages  = ref([])
const users  = ref([])

function loadAll() {
  movies.value = AdminStore.listMovies()
  pages.value  = AdminStore.listPages()
  users.value  = AdminStore.listUsers()
}
onMounted(loadAll)

/* ===== Movies ===== */
const showMovie = ref(false)
const movieForm = ref({
  id:null, title:'', year:'', poster:'',
  genres:[], genresText:'', description:'', trailerUrl:'', streamUrl:''
})

function openMovie(m=null){
  if (m) {
    movieForm.value = {
      id: m.id,
      title: m.title || '',
      year: m.year || '',
      poster: m.poster || '',
      description: m.description || '',
      trailerUrl: m.trailerUrl || '',
      streamUrl: m.streamUrl || '',
      genres: Array.isArray(m.genres) ? m.genres : [],
      genresText: (m.genres || []).join(', ')
    }
  } else {
    movieForm.value = { id:null, title:'', year:'', poster:'', genres:[], genresText:'', description:'', trailerUrl:'', streamUrl:'' }
  }
  showMovie.value = true
}

function saveMovie(f){
  const genres = (f.genresText || '').split(',').map(s=>s.trim()).filter(Boolean)
  const obj = {
    id: f.id || uid(),
    title: f.title, year: f.year, poster: f.poster,
    genres,
    description: f.description, trailerUrl: f.trailerUrl, streamUrl: f.streamUrl,
    updatedAt: Date.now()
  }
  AdminStore.upsertMovie(obj) // sẽ phát db:changed
  showMovie.value = false
  loadAll()
}

function delMovie(id) {
  if (!confirm('Xoá phim này?')) return
  AdminStore.deleteMovie(id)
  loadAll()
}

/* ===== Pages ===== */
const showPage = ref(false)
const pageForm = ref({ id:null, slug:'', title:'', content:'', updatedAt:null })

function openPage(p = null) {
  pageForm.value = p
    ? { ...p }
    : { id:null, slug:'', title:'', content:'', updatedAt:null }
  showPage.value = true
}

function savePage(p) {
  const payload = { ...p, id: p.id || uid(), updatedAt: Date.now() }
  AdminStore.upsertPage(payload)
  showPage.value = false
  loadAll()
}

function delPage(id) {
  if (!confirm('Xoá trang này?')) return
  AdminStore.deletePage(id)
  loadAll()
}

/* ===== Users ===== */
const showUser = ref(false)
const userForm = ref({ id:null, name:'', email:'', isAdmin:false })

function openUser(u = null) {
  userForm.value = u ? { ...u } : { id:null, name:'', email:'', isAdmin:false }
  showUser.value = true
}

function saveUser(u) {
  const payload = { ...u, id: u.id || uid() }
  AdminStore.upsertUser(payload)
  showUser.value = false
  loadAll()
}

function delUser(id) {
  if (!confirm('Xoá người dùng này?')) return
  AdminStore.deleteUser(id)
  loadAll()
}

/* ===== helpers ===== */
function uid() { return Math.random().toString(36).slice(2, 10) }
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: grid;
  place-items: center;
  z-index: 1050;
}
.modal-card { width: min(720px, 92vw); }
</style>
