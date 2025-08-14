// Chuyển các URL video phổ biến thành URL nhúng (embed) dùng cho <iframe>
// Trả về chuỗi rỗng nếu không hỗ trợ (khi đó hãy mở tab mới thay vì nhúng).

export function toEmbed(url) {
    if (!url) return '';
    let u;
    try {
        u = new URL(url);
    } catch {
        // nếu không phải URL hợp lệ -> bỏ
        return '';
    }

    const host = u.hostname.replace(/^www\./, '').toLowerCase();

    // ===== YouTube =====
    // Hỗ trợ cả youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/shorts/<id>
    if (host.includes('youtu.be')) {
        const id = u.pathname.slice(1);
        return id ? `https://www.youtube.com/embed/${id}` : '';
    }
    if (host.includes('youtube.com')) {
        if (u.pathname.startsWith('/shorts/')) {
            const id = u.pathname.split('/')[2];
            return id ? `https://www.youtube.com/embed/${id}` : '';
        }
        const id = u.searchParams.get('v') || '';
        return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    // ===== Vimeo =====
    // vimeo.com/<id>
    if (host.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean).pop();
        return id ? `https://player.vimeo.com/video/${id}` : '';
    }

    // ===== Dailymotion =====
    // dailymotion.com/video/<id>
    if (host.includes('dailymotion.com')) {
        const after = u.pathname.split('/video/')[1];
        const id = after ? after.split('_')[0] : '';
        return id ? `https://www.dailymotion.com/embed/video/${id}` : '';
    }

    // Không hỗ trợ platform khác
    return '';
}