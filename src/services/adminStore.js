// src/services/adminStore.js
import { STORE_KEYS } from './localData'
const { K_MOVIES, K_PAGES, K_USERS } = STORE_KEYS

const read = (k, def = []) => {
    try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v || def } catch { return def }
}
const write = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v))
    window.dispatchEvent(new Event('db:changed'))
}
const uid = () => Math.random().toString(36).slice(2, 10)

export const AdminStore = {
    // MOVIES
    listMovies() { return read(K_MOVIES, []) },
    upsertMovie(m) {
        const list = read(K_MOVIES, [])
        const obj = {...m, id: m.id || uid(), updatedAt: m.updatedAt || Date.now() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_MOVIES, list)
    },
    deleteMovie(id) {
        write(K_MOVIES, read(K_MOVIES, []).filter(x => String(x.id) !== String(id)))
    },

    // PAGES
    listPages() { return read(K_PAGES, []) },
    upsertPage(p) {
        const list = read(K_PAGES, [])
        const obj = {...p, id: p.id || uid(), updatedAt: Date.now() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_PAGES, list)
    },
    deletePage(id) {
        write(K_PAGES, read(K_PAGES, []).filter(x => String(x.id) !== String(id)))
    },

    // USERS (nếu bạn cần quản trị users ở Admin)
    listUsers() { return read(K_USERS, []) },
    upsertUser(u) {
        const list = read(K_USERS, [])
        const obj = {...u, id: u.id || uid() }
        const i = list.findIndex(x => String(x.id) === String(obj.id))
        if (i >= 0) list[i] = obj;
        else list.unshift(obj)
        write(K_USERS, list)
    },
    deleteUser(id) {
        write(K_USERS, read(K_USERS, []).filter(x => String(x.id) !== String(id)))
    }
}