import api from '../services/api';

export function saveUser(u) { localStorage.setItem('user', JSON.stringify(u)); }
export function getUser() { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } }
export function clearUser() { localStorage.removeItem('user'); }

export async function loginByEmailPass(email, password) {
    const em = (email || '').trim().toLowerCase();
    const pw = (password || '').trim();

    // Lấy hết users rồi lọc ở client để bỏ qua hoa/thường email (JSON Server không hỗ trợ toLowerCase)
    const { data: users } = await api.get('/users');
    const user = users.find(u => (u.email || '').toLowerCase() === em && String(u.password) === pw);
    return user || null;
}

export async function registerUser({ name, email, password, avatar }) {
    const em = (email || '').trim().toLowerCase();
    if (!name || !em || !password) throw new Error('Vui lòng nhập đủ họ tên, email, mật khẩu');

    const { data: users } = await api.get('/users');
    const existed = users.some(u => (u.email || '').toLowerCase() === em);
    if (existed) throw new Error('Email đã tồn tại');

    const { data: created } = await api.post('/users', { name: name.trim(), email: em, password: String(password).trim(), avatar: (avatar || '').trim() });
    return created;
}