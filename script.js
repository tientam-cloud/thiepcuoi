// === Render Calendar for WEDDING_DATE (đợi DOM sẵn sàng) ===
// function renderCalendar(){
//     if (!window.WEDDING_DATE) return;

//     const y = WEDDING_DATE.getFullYear();
//     const m = WEDDING_DATE.getMonth();
//     const d = WEDDING_DATE.getDate();

//     const titleEl = document.getElementById('calTitle');
//     const gridEl  = document.getElementById('calGrid');
//     if (!titleEl || !gridEl) return; // phòng hờ

//     // Tiêu đề tháng
//     titleEl.textContent = WEDDING_DATE.toLocaleDateString('vi-VN', {
//         month: 'long', year: 'numeric'
//     });

//     // Xóa cũ rồi vẽ mới
//     gridEl.innerHTML = '';

//     // Header CN..T7
//     ['CN','T2','T3','T4','T5','T6','T7'].forEach(w => {
//         const e = document.createElement('div');
//         e.className = 'wd';
//         e.textContent = w;
//         gridEl.appendChild(e);
//     });

//     const first = new Date(y, m, 1);
//     const pad = first.getDay(); // 0=CN
//     const daysInMonth = new Date(y, m + 1, 0).getDate();

//     // Padding trước ngày 1
//     for (let i = 0; i < pad; i++) {
//         const e = document.createElement('div');
//         e.className = 'day is-empty';
//         gridEl.appendChild(e);
//     }

//     // Ngày trong tháng
//     for (let i = 1; i <= daysInMonth; i++) {
//         const e = document.createElement('div');
//         e.className = 'day';
//         e.textContent = i;
//         if (i === d) e.classList.add('is-wedding');
//         gridEl.appendChild(e);
//     }
// }

// // GỌI SAU KHI DOM SẴN SÀNG
// document.addEventListener('DOMContentLoaded', renderCalendar);


// ngày cưới của bạn
function renderWeddingCalendar(rootId, month, year) {
	const grid = document.getElementById('calGrid');
	const mEl = document.getElementById('calMonth');
	const yEl = document.getElementById('calYear');
	if (!grid || !mEl || !yEl) return;

	mEl.textContent = month + 1;
	yEl.textContent = year;
	grid.innerHTML = '';

	// Header Thứ 2..CN
	['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].forEach(t => {
		const el = document.createElement('div'); el.className = 'wd'; el.textContent = t; grid.appendChild(el);
	});

	// Padding (tuần bắt đầu Thứ 2)
	const first = new Date(year, month, 1);
	const pad = (first.getDay() + 6) % 7;
	for (let i = 0; i < pad; i++) { const e = document.createElement('div'); e.className = 'day is-empty'; grid.appendChild(e); }

	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// Lấy đúng y/m/d của ngày cưới để so sánh
	const wy = WEDDING_DATE.getFullYear();
	const wm = WEDDING_DATE.getMonth();
	const wd = WEDDING_DATE.getDate();

	for (let i = 1; i <= daysInMonth; i++) {
		const cell = document.createElement('div'); cell.className = 'day';
		const n = document.createElement('span'); n.className = 'n'; n.textContent = i; cell.appendChild(n);

		// 👉 Chỉ thêm class nếu LÀ đúng ngày cưới (năm, tháng, ngày đều khớp)
		if (year === wy && month === wm && i === wd) cell.classList.add('is-wedding');

		grid.appendChild(cell);
	}
}

// Gọi khi DOM sẵn sàng – hiển thị tháng 10/2025
document.addEventListener('DOMContentLoaded', () => {
	renderWeddingCalendar('weddingCalendar', 9 /*Oct: 0-based*/, 2025);
});


(() => {
	const rows = document.querySelectorAll('#story .story-row');
	if (!rows.length) return;

	const io = new IntersectionObserver((entries, obs) => {
		entries.forEach(e => {
			if (!e.isIntersecting) return;
			e.target.classList.add('is-in');   // đã vào khung nhìn
			obs.unobserve(e.target);           // chỉ phát 1 lần
		});
	}, { threshold: 0.28 });

	rows.forEach(r => io.observe(r));
})();


/* Scroll-in: thêm .is-in cho mỗi .story-row khi visible 20% */
(function () {
	const rows = document.querySelectorAll('#story .story-row[data-anim]');
	if (!('IntersectionObserver' in window) || !rows.length) {
		rows.forEach(r => r.classList.add('is-in'));
		return;
	}
	const io = new IntersectionObserver((entries, obs) => {
		entries.forEach(e => {
			if (e.isIntersecting) {
				e.target.classList.add('is-in');
				obs.unobserve(e.target);
			}
		});
	}, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
	rows.forEach(r => io.observe(r));
})();

/* Lazy load GIF hoa để nó nở đúng lúc lăn tới */
(function lazyFlower(id) {
	const img = document.getElementById(id);
	if (!img) return;
	const io = new IntersectionObserver(([entry], obs) => {
		if (!entry.isIntersecting) return;
		const src = img.dataset.src;
		if (src) {
			// cache-bust nhẹ để GIF chạy từ frame đầu
			img.src = src + (src.includes('?') ? '&' : '?') + 't=' + Date.now();
			img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
		}
		obs.unobserve(img);
	}, { threshold: 0.55 });
	io.observe(img);
})('storyFlower');

window.addEventListener('resize', () => {
	document.querySelectorAll('#story .story-row').forEach(r => {
		const rect = r.getBoundingClientRect();
		if (rect.top < innerHeight * 0.9) r.classList.add('is-in');
	});
});
