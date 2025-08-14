import { createRouter, createWebHistory } from 'vue-router'

const Home = () =>
    import ('../views/Home.vue')
const Browse = () =>
    import ('../views/Browse.vue')
const MovieDetail = () =>
    import ('../views/MovieDetail.vue')
const Profile = () =>
    import ('../views/Profile.vue')
const Login = () =>
    import ('../views/Login.vue')
const Register = () =>
    import ('../views/Register.vue')
const Admin = () =>
    import ('../views/Admin.vue')

function getSessionUser() {
    try {
        const raw = sessionStorage.getItem('app_user_session') || localStorage.getItem('app_user_session') || null
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: Home },
        { path: '/browse', name: 'browse', component: Browse },

        { path: '/dang-chieu', redirect: { name: 'browse', query: { tab: 'dang-chieu' } } },
        { path: '/danh-gia-cao', redirect: { name: 'browse', query: { tab: 'danh-gia-cao' } } },
        { path: '/lich-chieu', redirect: { name: 'browse', query: { tab: 'lich-chieu' } } },
        { path: '/phim-le', redirect: { name: 'browse', query: { tab: 'phim-le' } } },
        { path: '/top-10', redirect: { name: 'browse', query: { tab: 'top-10' } } },

        { path: '/movie/:id', name: 'movie', component: MovieDetail, props: true },
        { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
        { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
        { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },

        // Admin: hỗ trợ cả /app-admin và /admin
        { path: '/app-admin', name: 'admin', component: Admin, meta: { requiresAdmin: true } },
        { path: '/admin', component: Admin, meta: { requiresAdmin: true } }, // alias
    ],
    scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
    const raw = sessionStorage.getItem('app_user_session') || localStorage.getItem('app_user_session')
    const authed = !!raw
    const needsAuth = !!to.meta && to.meta.requiresAuth
    const guestOnly = !!to.meta && to.meta.guestOnly
    const requiresAdmin = !!to.meta && to.meta.requiresAdmin

    if (needsAuth && !authed) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (guestOnly && authed) {
        return { name: 'home' }
    }
    if (requiresAdmin) {
        if (!authed) {
            return { name: 'login', query: { redirect: to.fullPath } }
        }
        const u = getSessionUser()
        const canAdmin = (!!u && u.isAdmin) || ((u && u.roles || []).includes('admin')) // ✅ đồng bộ
        if (!canAdmin) {
            return { name: 'home' } // hoặc trỏ sang trang 403
        }
    }
})
export default router