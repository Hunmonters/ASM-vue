<template>
  <div class="container py-5" style="max-width:520px">
    <div class="card bg-dark text-light">
      <div class="card-body">
        <h4 class="mb-4 text-center">Đăng ký</h4>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Tên hiển thị</label>
            <input v-model.trim="name" class="form-control bg-dark text-light border-secondary"
                   placeholder="vd: Pan"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model.trim="email" type="email"
                   class="form-control bg-dark text-light border-secondary"
                   placeholder="email@domain.com"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input v-model="password" type="password"
                   class="form-control bg-dark text-light border-secondary"
                   placeholder="••••••••"/>
          </div>

          

          <button class="btn btn-primary w-100" :disabled="loading">
            <span v-if="!loading">Tạo tài khoản</span>
            <span v-else>Đang tạo…</span>
          </button>
        </form>

        <div class="text-center mt-3">
          <router-link class="small" to="/login">Đã có tài khoản? Đăng nhập</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DB } from '../services/db'
import { Auth } from '../services/auth'
import { AdminStore } from '../services/adminStore'
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const avatar = ref('')
const loading = ref(false)

async function submit () {
  if (!name.value || !email.value || !password.value) {
    alert('Vui lòng nhập đủ tên, email và mật khẩu')
    return
  }
  loading.value = true
  try {
    const existed = DB.getUserByNameOrEmail(email.value.trim().toLowerCase())
                   || DB.getUserByNameOrEmail(name.value.trim())
    if (existed) { alert('Tên hoặc email đã tồn tại'); return }

    // tạo user trong DB chính
    const user = DB.upsertUser({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      avatar: avatar.value || null,
      cover: null,
      locked: false,
      roles: [], // không phải admin
      stats: { tuvi: 0, tinhthach: 0, tienngoc: 0 }
    })

    // ---- đồng bộ qua AdminStore để Admin.vue thấy ngay ----
    AdminStore.upsertUser({
      id: user.id,                    // quan trọng: dùng đúng id
      name: user.name,
      email: user.email,
      isAdmin: !!(user.roles || []).includes('admin')
    }) // 👈 thêm vào kho của Admin
    window.dispatchEvent(new Event('db:changed')) // 👈 cho Admin/Home/Browse reload

    // đăng nhập ngay
    Auth.set(user)
    router.replace({ name: 'profile' })
  } finally {
    loading.value = false
  }
}

</script>
