// src/services/db.js
const K_MOVIES = 'app_movies'
const K_PAGES = 'app_pages'
const K_USERS = 'app_users'
const K_SEEDV = 'app_seed_version'
const CURRENT_SEED_VERSION = '1' // tăng số này nếu bạn đổi data.json

const read = (k, def = []) => {
    try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v || def } catch { return def }
}
const write = (k, v, silent = false) => {
    localStorage.setItem(k, JSON.stringify(v))
    if (!silent) window.dispatchEvent(new Event('db:changed'))
}
const uid = () => Math.random().toString(36).slice(2, 10)

export const DB = {
    // --- SEED ---
    seedOnce(seed) {
        const ok = localStorage.getItem(K_SEEDV) === CURRENT_SEED_VERSION
        const hasAny = !!localStorage.getItem(K_MOVIES) || !!localStorage.getItem(K_PAGES)
        if (ok && hasAny) return
        write(K_MOVIES, seed && seed.movies || [], true)
        write(K_PAGES, seed && seed.pages || [], true)
        write(K_USERS, seed && seed.users || [], true)
        localStorage.setItem(K_SEEDV, CURRENT_SEED_VERSION)
        window.dispatchEvent(new Event('db:changed'))
    },

    // --- MOVIES ---
    listMovies() { return read(K_MOVIES, []) },
    getMovie(id) { return this.listMovies().find(x => String(x.id) === String(id)) || null },
    upsertMovie(m) {
        const list = this.listMovies()
        const obj = { updatedAt: Date.now(), ...m, id: m.id || uid() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_MOVIES, list)
        return obj
    },
    deleteMovie(id) {
        write(K_MOVIES, this.listMovies().filter(x => String(x.id) !== String(id)))
    },
    getGenres() {
        const s = new Set()
        for (const m of this.listMovies())(m.genres || []).forEach(g => g && s.add(g))
        return Array.from(s).sort()
    },

    // --- PAGES ---
    listPages() { return read(K_PAGES, []) },
    getPage(slug) { return this.listPages().find(p => p.slug === slug) || null },
    upsertPage(p) {
        const list = this.listPages()
        const obj = { updatedAt: Date.now(), ...p, id: p.id || uid() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_PAGES, list)
        return obj
    },
    deletePage(id) {
        write(K_PAGES, this.listPages().filter(x => String(x.id) !== String(id)))
    },

    // --- USERS ---
    listUsers() { return read(K_USERS, []) },
    upsertUser(u) {
        const list = this.listUsers()
        const obj = {...u, id: u.id || uid() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_USERS, list)
        return obj
    },
    deleteUser(id) {
        write(K_USERS, this.listUsers().filter(x => String(x.id) !== String(id)))
    },
    getUserByNameOrEmail(val) {
        const v = (val || '').toLowerCase()
        return this.listUsers().find(u =>
            (u.email || '').toLowerCase() === v || (u.name || '').toLowerCase() === v
        ) || null
    }
}