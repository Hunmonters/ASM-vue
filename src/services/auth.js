// src/services/auth.js
const KEY = 'app_user_session';

function emitAuthChanged(user) {
    try {
        window.dispatchEvent(new CustomEvent('auth:changed', { detail: user || null }));
        // ping storage listeners
        window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: user ? JSON.stringify(user) : null }));
    } catch {}
}

export const Auth = {
    key: KEY,
    get() {
        try {
            // ưu tiên phiên hiện tại
            const s = sessionStorage.getItem(KEY);
            if (s) return JSON.parse(s);
            const l = localStorage.getItem(KEY);
            return l ? JSON.parse(l) : null;
        } catch { return null; }
    },
    set(user) {
        // nếu login “không ghi nhớ”
        if (user && user.sessionOnly) {
            sessionStorage.setItem(KEY, JSON.stringify(user));
            localStorage.removeItem(KEY);
        } else if (user) {
            localStorage.setItem(KEY, JSON.stringify(user));
            sessionStorage.removeItem(KEY);
        } else {
            sessionStorage.removeItem(KEY);
            localStorage.removeItem(KEY);
        }
        emitAuthChanged(user || null);
    },
    clear() {
        this.set(null);
    },
    isLoggedIn() { return !!this.get(); },
    userId() { const u = this.get(); return u ? u.id : 'guest'; }
};