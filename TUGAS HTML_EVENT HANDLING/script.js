const portfolioData = [
    { id: 1, judul: "Proyek Web Profil Pertama", deskripsi: "Mengembangkan halaman dasar profil pribadi menggunakan struktur semantik HTML5." },
    { id: 2, judul: "Desain UI/UX Aplikasi", deskripsi: "Merancang wireframe dan prototype interaktif untuk aplikasi mobile tugas kuliah." }
];

const container = document.getElementById('portfolio-container');
const containerArtikel = document.getElementById('artikel-container');

function renderPortfolio() {
    if (!container) return;
    if (portfolioData.length === 0) {
        container.innerHTML = "<p style='font-style: italic; color: #888;'>Belum ada item portofolio saat ini.</p>";
        return;
    }

    container.innerHTML = portfolioData.map(item => `
        <div class="portfolio-item" data-id="${item.id}">
            <h3>${item.judul}</h3>
            <p>${item.deskripsi}</p>
            <button class="btn-hapus">Hapus</button>
        </div>
    `).join('');
}

const btnSimpan = document.getElementById('btn-simpan');
if (btnSimpan) {
    btnSimpan.addEventListener('click', () => {
        const inputJudul = document.getElementById('input-judul');
        const inputDeskripsi = document.getElementById('input-deskripsi');

        const judulValue = inputJudul.value.trim();
        const deskripsiValue = inputDeskripsi.value.trim();

        if (judulValue !== "" && deskripsiValue !== "") {
            const newItem = {
                id: Date.now(),
                judul: judulValue,
                deskripsi: deskripsiValue
            };
            portfolioData.push(newItem);
            renderPortfolio();
            inputJudul.value = "";
            inputDeskripsi.value = "";
        } else {
            alert("Mohon isi Judul dan Deskripsi terlebih dahulu!");
        }
    });
}

if (container) {
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-hapus')) {
            const itemElement = event.target.closest('.portfolio-item');
            const idHapus = parseInt(itemElement.getAttribute('data-id'));
            const index = portfolioData.findIndex(item => item.id === idHapus);
            if (index !== -1) {
                portfolioData.splice(index, 1);
            }
            renderPortfolio();
        }
    });
}

const toggleBtn = document.getElementById('dark-mode-toggle');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleDarkMode);
}

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key.toLowerCase() === "d") {
        toggleDarkMode();
    }
});

if (containerArtikel) {
    containerArtikel.addEventListener("mouseover", (e) => {
        const article = e.target.closest("article");
        if (article) {
            article.classList.add("artikel-hover");
            if (!article.querySelector(".btn-like")) {
                const tombolLike = document.createElement("button");
                tombolLike.classList.add("btn-like");
                tombolLike.dataset.like = "0";
                tombolLike.textContent = 'Like (0)';
                article.appendChild(tombolLike);
            }
        }
    });

    containerArtikel.addEventListener("mouseout", (e) => {
        const article = e.target.closest("article");
        if (article) {
            article.classList.remove("artikel-hover");
        }
    });

    containerArtikel.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
            let jumlah = parseInt(e.target.dataset.like || 0);
            jumlah++;
            e.target.dataset.like = jumlah;
            e.target.textContent = `Like (${jumlah})`;
        }
    });
}

const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");

if (formKomentar && daftarKomentar) {
    formKomentar.addEventListener("submit", (e) => {
        e.preventDefault();
        const nama = document.querySelector("#input-nama").value.trim();
        const pesan = document.querySelector("#input-pesan").value.trim();
        
        if (nama === "" || pesan === "") {
            alert("Nama dan komentar wajib diisi!");
            return;
        }

        const itemKomentar = document.createElement("li");
        itemKomentar.innerHTML = `<strong>${nama}</strong>: <p>${pesan}</p>`;
        daftarKomentar.appendChild(itemKomentar);
        formKomentar.reset(); 
    });
}

renderPortfolio();
