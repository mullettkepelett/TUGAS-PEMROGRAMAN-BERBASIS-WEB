const portfolioData = [
    { id: 1, judul: "Proyek Web Profil Pertama", deskripsi: "Mengembangkan halaman dasar profil pribadi menggunakan struktur semantik HTML5." },
    { id: 2, judul: "Desain UI/UX Aplikasi", deskripsi: "Merancang wireframe dan prototype interaktif untuk aplikasi mobile tugas kuliah." }
];

const container = document.getElementById('portfolio-container');

function renderPortfolio() {
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

document.getElementById('btn-simpan').addEventListener('click', () => {
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
}});
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
const toggleBtn = document.getElementById('dark-mode-toggle');
toggleBtn.addEventListener('click', () => {
document.body.classList.toggle('dark-mode');
});
renderPortfolio();
