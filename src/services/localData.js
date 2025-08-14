// src/services/localData.js
const K_MOVIES = 'app_movies'
const K_PAGES = 'app_pages'
const K_USERS = 'app_users'
const K_SEEDV = 'app_seed_version' // để sau này đổi json thì ép seed lại
const CURRENT_SEED_VERSION = '1' // tăng số này nếu bạn thay data.json

const read = (k, def = []) => {
    try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v || def } catch { return def }
}
const write = (k, v, quiet = false) => {
    localStorage.setItem(k, JSON.stringify(v))
    if (!quiet) window.dispatchEvent(new Event('db:changed'))
}

/** Ghi dữ liệu mẫu vào localStorage nếu chưa có (hoặc khi version đổi) */
async function ensureSeed() {
    const ok = localStorage.getItem(K_SEEDV) === CURRENT_SEED_VERSION
    const hasAny = !!localStorage.getItem(K_MOVIES) || !!localStorage.getItem(K_PAGES)

    if (ok && hasAny) return

    // ✅ Vite cho phép import JSON trực tiếp
    const seed = (await
        import ('../data/data.json')).default || {}
    write(K_MOVIES, seed.movies || [], true)
    write(K_PAGES, seed.pages || [], true)
    write(K_USERS, seed.users || [], true)

    localStorage.setItem(K_SEEDV, CURRENT_SEED_VERSION)
    window.dispatchEvent(new Event('db:changed'))
}

export const LocalAPI = {
    ensureSeed,

    async getMovies({ q = '', genre = '', sort = 'updatedAt', order = 'desc', limit = 60 } = {}) {
        let list = read(K_MOVIES, [])

        if (q) {
            const key = q.toLowerCase()
            list = list.filter(m => (m.title || '').toLowerCase().includes(key))
        }
        if (genre) {
            const g = genre.toLowerCase()
            list = list.filter(m => (m.genres || []).some(x => (x || '').toLowerCase() === g))
        }

        const dir = order === 'asc' ? 1 : -1
        list = list.sort((a, b) => ((a && a[sort] || 0) > (b && b[sort] || 0) ? dir : -dir))
        return list.slice(0, limit)
    },

    async getMovie(id) {
        const list = read(K_MOVIES, [])
        return list.find(m => String(m.id) === String(id)) || null
    },

    async getGenres() {
        const list = read(K_MOVIES, [])
        const s = new Set()
        for (const m of list)(m.genres || []).forEach(g => g && s.add(g))
        return Array.from(s).sort()
    },

    async getPage(slug) {
        const pages = read(K_PAGES, [])
        return pages.find(p => p.slug === slug) || null
    }
}

// Export key để nơi khác dùng chung (AdminStore)
export const STORE_KEYS = { K_MOVIES, K_PAGES, K_USERS }