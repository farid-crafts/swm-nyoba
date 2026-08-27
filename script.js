/* Initial Sample Seed Questions */
const defaultQuestions = [
    {
        id: 1,
        subtes: "Penalaran Umum",
        pertanyaan: "Semua pejuang PTN yang rajin latihan soal akan memahami pola materi UTBK. Sebagian pejuang PTN di grup Study with Mbah rajin latihan soal. Kesimpulan yang paling tepat adalah...",
        pilihan: {
            A: "Semua pejuang PTN di grup Study with Mbah memahami pola materi UTBK.",
            B: "Sebagian pejuang PTN di grup Study with Mbah memahami pola materi UTBK.",
            C: "Semua pejuang PTN tidak memahami pola materi UTBK.",
            D: "Sebagian pejuang PTN yang tidak belajar pasti lulus UTBK.",
            E: "Tidak dapat ditarik kesimpulan dari dua premis di atas."
        },
        kunci: "B",
        pembahasan: "Premis 1: Semua A (rajin) -> B (paham). Premis 2: Sebagian C (anak Mbah) -> A (rajin). Kesimpulan silogisme kuantifier partikular adalah 'Sebagian C -> B' (Sebagian pejuang PTN di grup Study with Mbah memahami pola materi UTBK)."
    },
    {
        id: 2,
        subtes: "Pengetahuan Kuantitatif",
        pertanyaan: "Jika x = 3 dan y = 4, berapakah nilai dari 2x² + 3y - 5?",
        pilihan: {
            A: "20",
            B: "23",
            C: "25",
            D: "27",
            E: "30"
        },
        kunci: "C",
        pembahasan: "Substitusi nilai x dan y: 2(3)² + 3(4) - 5 = 2(9) + 12 - 5 = 18 + 12 - 5 = 25."
    },
    {
        id: 3,
        subtes: "Penalaran Matematika",
        pertanyaan: "Sebuah toko memberikan diskon bertingkat 20% kemudian didiskon lagi 10%. Berapakah total persentase diskon sebenarnya dari harga awal?",
        pilihan: {
            A: "30%",
            B: "28%",
            C: "25%",
            D: "32%",
            E: "18%"
        },
        kunci: "B",
        pembahasan: "Misal harga awal = 100. Diskon pertama 20% -> Sisa harga = 80. Diskon kedua 10% dari 80 = 8. Sisa harga akhir = 72. Total diskon = 100 - 72 = 28%."
    }
];

// LocalStorage Helper
function getQuestions() {
    const data = localStorage.getItem('swm_questions');
    if (!data) {
        localStorage.setItem('swm_questions', JSON.stringify(defaultQuestions));
        return defaultQuestions;
    }
    return JSON.parse(data);
}

function saveQuestions(questions) {
    localStorage.setItem('swm_questions', JSON.stringify(questions));
}

document.addEventListener('DOMContentLoaded', () => {
    /* 1. Canvas Interactive Particles Background */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particleColors = ['#052659', '#5483B3', '#7DA0CA', '#d97706'];
        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 1,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            color: particleColors[Math.floor(Math.random() * particleColors.length)]
        }));

        function drawCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.4;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = (1 - dist / 120) * 0.15;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawCanvas);
        }
        drawCanvas();
    }

    /* 2. Theme Toggle Handler */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });
    }
});

/* Render Latsol Page */
let currentFilter = 'semua';

function renderLatsolPage() {
    const grid = document.getElementById('questions-grid');
    const empty = document.getElementById('empty-state');
    if (!grid) return;

    const questions = getQuestions();
    const filtered = currentFilter === 'semua' 
        ? questions 
        : questions.filter(q => q.subtes === currentFilter);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = filtered.map((q, idx) => `
        <div class="glass-card rounded-2xl p-6 border-l-4 border-l-pine-500 shadow-md">
            <div class="flex items-center justify-between gap-2 mb-3">
                <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-pine-500/20 text-pine-900 dark:text-pine-100 border border-pine-500/30">
                    #${idx + 1} — ${q.subtes}
                </span>
                <span class="text-xs text-pine-700 dark:text-pine-300 font-mono">UTBK SNBT</span>
            </div>

            <p class="text-sm sm:text-base font-bold text-pine-900 dark:text-white leading-relaxed mb-4">
                ${q.pertanyaan}
            </p>

            <div class="space-y-2 mb-4">
                ${Object.entries(q.pilihan).map(([key, val]) => `
                    <button onclick="checkAnswer(${q.id}, '${key}')" id="opt-${q.id}-${key}" class="w-full text-left p-3 rounded-xl border border-pine-500/20 bg-pine-50/30 dark:bg-pine-800/30 hover:border-pine-500 transition-all text-xs sm:text-sm font-medium text-pine-900 dark:text-pine-100 flex items-start gap-3">
                        <span class="font-bold font-mono px-2 py-0.5 rounded bg-pine-500/20 text-pine-900 dark:text-pine-100">${key}</span>
                        <span class="flex-1">${val}</span>
                    </button>
                `).join('')}
            </div>

            <!-- Feedback & Pembahasan Box -->
            <div id="feedback-${q.id}" class="hidden p-4 rounded-xl text-xs sm:text-sm leading-relaxed border mt-3"></div>
        </div>
    `).join('');
}

function filterSoal(subtes) {
    currentFilter = subtes;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.subtes === subtes) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderLatsolPage();
}

function checkAnswer(questionId, selectedOpt) {
    const questions = getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return;

    const feedbackBox = document.getElementById(`feedback-${questionId}`);
    if (!feedbackBox) return;

    // Reset button styling for this question
    Object.keys(q.pilihan).forEach(key => {
        const btn = document.getElementById(`opt-${questionId}-${key}`);
        if (btn) {
            btn.className = "w-full text-left p-3 rounded-xl border border-pine-500/20 bg-pine-50/30 dark:bg-pine-800/30 text-xs sm:text-sm font-medium text-pine-900 dark:text-pine-100 flex items-start gap-3 opacity-70";
        }
    });

    const selectedBtn = document.getElementById(`opt-${questionId}-${selectedOpt}`);
    const correctBtn = document.getElementById(`opt-${questionId}-${q.kunci}`);

    if (selectedOpt === q.kunci) {
        if (selectedBtn) selectedBtn.className = "w-full text-left p-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-start gap-3";
        feedbackBox.className = "p-4 rounded-xl text-xs sm:text-sm leading-relaxed border border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 block";
        feedbackBox.innerHTML = `
            <div class="font-bold text-sm mb-1">🎉 Jawaban Kamu BENAR! (Kunci: ${q.kunci})</div>
            <div class="font-mono text-xs mb-2"><strong>Pembahasan Mbah:</strong></div>
            <div>${q.pembahasan}</div>
        `;
    } else {
        if (selectedBtn) selectedBtn.className = "w-full text-left p-3 rounded-xl border-2 border-rose-500 bg-rose-500/20 text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200 flex items-start gap-3";
        if (correctBtn) correctBtn.className = "w-full text-left p-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-start gap-3";
        
        feedbackBox.className = "p-4 rounded-xl text-xs sm:text-sm leading-relaxed border border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200 block";
        feedbackBox.innerHTML = `
            <div class="font-bold text-sm mb-1">❌ Jawaban Kurang Tepat (Jawaban Benar: ${q.kunci})</div>
            <div class="font-mono text-xs mb-2"><strong>Pembahasan Mbah:</strong></div>
            <div>${q.pembahasan}</div>
        `;
    }
}

/* Render Admin Page */
function renderAdminPage() {
    const list = document.getElementById('admin-questions-list');
    const countEl = document.getElementById('total-soal-count');
    if (!list) return;

    const questions = getQuestions();
    if (countEl) countEl.innerText = questions.length;

    if (questions.length === 0) {
        list.innerHTML = `<div class="text-center py-8 text-xs text-pine-700 dark:text-pine-300">Belum ada soal terdaftar.</div>`;
        return;
    }

    list.innerHTML = questions.map((q, idx) => `
        <div class="p-4 rounded-xl bg-pine-50/50 dark:bg-pine-800/40 border border-pine-500/20 relative group">
            <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pine-500/20 text-pine-900 dark:text-pine-100">
                    ${q.subtes}
                </span>
                <button onclick="deleteQuestion(${q.id})" class="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded bg-rose-500/10">
                    🗑️ Hapus
                </button>
            </div>
            <p class="text-xs font-bold text-pine-900 dark:text-white line-clamp-2 mb-2">
                ${idx + 1}. ${q.pertanyaan}
            </p>
            <div class="text-[11px] font-mono text-jawa-amber font-bold">
                Kunci: ${q.kunci}
            </div>
        </div>
    `).join('');
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const subtes = document.getElementById('subtes').value;
    const pertanyaan = document.getElementById('pertanyaan').value.trim();
    const optA = document.getElementById('opt-A').value.trim();
    const optB = document.getElementById('opt-B').value.trim();
    const optC = document.getElementById('opt-C').value.trim();
    const optD = document.getElementById('opt-D').value.trim();
    const optE = document.getElementById('opt-E').value.trim();
    const kunci = document.getElementById('kunci').value;
    const pembahasan = document.getElementById('pembahasan').value.trim();

    const newQuestion = {
        id: Date.now(),
        subtes,
        pertanyaan,
        pilihan: { A: optA, B: optB, C: optC, D: optD, E: optE },
        kunci,
        pembahasan
    };

    const questions = getQuestions();
    questions.unshift(newQuestion);
    saveQuestions(questions);

    showToast('🚀 Soal baru berhasil diupload!');
    e.target.reset();
    renderAdminPage();
}

function deleteQuestion(id) {
    if (confirm('Yakin ingin menghapus soal ini?')) {
        let questions = getQuestions();
        questions = questions.filter(q => q.id !== id);
        saveQuestions(questions);
        showToast('🗑️ Soal berhasil dihapus.');
        renderAdminPage();
    }
}

function resetDefaultQuestions() {
    if (confirm('Kembalikan ke soal sampel awal?')) {
        saveQuestions(defaultQuestions);
        showToast('🔄 Soal direset ke bawaan.');
        renderAdminPage();
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.innerText = msg;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
}
