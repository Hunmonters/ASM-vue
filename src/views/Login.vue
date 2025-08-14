<template>
  <div class="container py-5" style="max-width:460px">
    <div class="card bg-dark text-light">
      <div class="card-body">
        <h4 class="mb-4 text-center">Đăng nhập</h4>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Email hoặc tên tài khoản</label>
            <input v-model.trim="login" class="form-control bg-dark text-light border-secondary"
                   placeholder="email@domain.com hoặc username" autocomplete="username" />
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input v-model="password" type="password"
                   class="form-control bg-dark text-light border-secondary"
                   placeholder="••••••••" autocomplete="current-password" />
          </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="remember" id="rememberMe">
              <label class="form-check-label" for="rememberMe">Ghi nhớ</label>
            </div>
          </div>

          <button class="btn btn-primary w-100" :disabled="loading">
            <span v-if="!loading">Đăng nhập</span>
            <span v-else>Đang đăng nhập…</span>
          </button>
        </form>

        <div class="text-center mt-3">
          <router-link class="small" to="/register">Chưa có tài khoản? Đăng ký</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DB } from '../services/db'
import { Auth } from '../services/auth'

const router = useRouter()
const route  = useRoute()

const login = ref('')
const password = ref('')
const remember = ref(true)
const loading  = ref(false)

async function submit () {
  const lg = login.value.trim()
  const pw = String(password.value ?? '')
  if (!lg || !pw) return alert('Nhập đầy đủ tài khoản/mật khẩu')

  loading.value = true
  try {
    // Tìm theo email (lowercase) hoặc username
    const user =
      DB.getUserByNameOrEmail(lg.toLowerCase()) ||
      DB.getUserByNameOrEmail(lg)

    if (!user)             return alert('Tài khoản không tồn tại')
    if (user.locked)       return alert('Tài khoản đã bị khóa')
    if (String(user.password) !== pw) return alert('Mật khẩu không đúng')

    // Lưu session: nếu không "Ghi nhớ" thì dùng sessionOnly
    Auth.set({ ...user, ...(remember.value ? {} : { sessionOnly: true }) })

    // Quyền admin (đồng bộ với guard & Profile.vue)
    const canAdmin = !!user.isAdmin || (user.roles || []).includes('admin')

    // Tính đích đến: ưu tiên redirect trên URL
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.trim()) {
      return router.replace(redirect)
    }

    // Không có redirect -> rẽ nhánh theo quyền
    return router.replace(canAdmin ? { name: 'admin' } : { name: 'profile' })
  } finally {
    loading.value = false
  }
}

</script>
