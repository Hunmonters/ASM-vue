// src/services/social.js
import { Auth } from './auth';

// Lưu theo user hiện tại (localStorage)
export const Social = {
    // ===== FOLLOW =====
    _followKey(uid = Auth.userId()) { return `follows:v1:${uid}`; },
    getFollowIds(uid = Auth.userId()) {
        try { return JSON.parse(localStorage.getItem(this._followKey(uid)) || '[]'); } catch { return []; }
    },
    _saveFollowIds(ids, uid = Auth.userId()) {
        localStorage.setItem(this._followKey(uid), JSON.stringify([...new Set(ids.map(String))]));
    },
    isFollow(movieId, uid = Auth.userId()) {
        return this.getFollowIds(uid).includes(String(movieId));
    },
    toggleFollow(movieId, uid = Auth.userId()) {
        const id = String(movieId);
        const ids = this.getFollowIds(uid);
        const i = ids.indexOf(id);
        if (i >= 0) ids.splice(i, 1);
        else ids.unshift(id);
        this._saveFollowIds(ids, uid);
        return this.isFollow(id, uid);
    },

    // ===== RATINGS per user =====
    _ratingKey(uid = Auth.userId()) { return `ratings:v1:${uid}`; },
    getUserRatings(uid = Auth.userId()) {
        try { return JSON.parse(localStorage.getItem(this._ratingKey(uid)) || '{}'); } catch { return {}; }
    },
    getUserStars(movieId, uid = Auth.userId()) {
        const map = this.getUserRatings(uid);
        return Number(map[String(movieId)] || 0);
    },
    getRatedIds(uid = Auth.userId()) {
        const map = this.getUserRatings(uid);
        return Object.keys(map).filter(k => Number(map[k]) > 0);
    },

    // ===== RATINGS aggregate per movie =====
    _aggKey(movieId) { return `ratingsAgg:v1:${String(movieId)}`; },
    _getAgg(movieId) {
        try { return JSON.parse(localStorage.getItem(this._aggKey(movieId)) || '{"sum":0,"count":0}'); } catch { return { sum: 0, count: 0 }; }
    },
    _saveAgg(movieId, agg) {
        localStorage.setItem(this._aggKey(movieId), JSON.stringify(agg));
    },
    setStars(movieId, stars, uid = Auth.userId()) {
        const id = String(movieId);
        const s = Math.max(0, Math.min(5, Number(stars) || 0));

        // 1) update user map
        const key = this._ratingKey(uid);
        const map = this.getUserRatings(uid);
        const prev = Number(map[id] || 0);
        map[id] = s;
        localStorage.setItem(key, JSON.stringify(map));

        // 2) update aggregate
        const agg = this._getAgg(id); // {sum, count}
        if (prev > 0 && agg.count > 0) {
            agg.sum += (s - prev);
            if (s === 0) agg.count -= 1;
        } else {
            if (s > 0) { agg.sum += s;
                agg.count += 1; }
        }
        if (agg.count === 0) agg.sum = 0;
        this._saveAgg(id, agg);
    },
    getAvgStars(movieId) {
        const { sum, count } = this._getAgg(movieId);
        return count > 0 ? +(sum / count).toFixed(1) : 0;
    },
    getRatingsCount(movieId) {
        const { count } = this._getAgg(movieId);
        return count || 0;
    }
};