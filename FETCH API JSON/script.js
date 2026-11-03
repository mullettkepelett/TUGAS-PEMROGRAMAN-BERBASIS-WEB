const dataAwalDefault = [
  {
    id: 1,
    judul: "Mengenal HTML Semantik",
    deskripsi:
      "Mengembangkan halaman dasar profil pribadi menggunakan struktur semantik HTML5.",
  },
  {
    id: 2,
    judul: "Dasar CSS Responsif",
    deskripsi: "Melakukan Styling terhadap halaman web dengan css",
  },
  {
    id: 3,
    judul: "Mengenal Java Script dan DOM",
    deskripsi:
      "Memungkinkan halaman web menjadi interaktif dengan Java Script ",
  },
];

const KUNCI_PORTOFOLIO = "portfolio-raw-string";
const AWALAN_LIKE = "portfolio-like-";

const container = document.getElementById("portfolio-container");

function simpanSemuaPortofolioTanpaJSON() {
  let stringData = "";
  for (let i = 0; i < portfolioData.length; i++) {
    const item = portfolioData[i];
    const baris =
      item.id +
      "|" +
      encodeURIComponent(item.judul) +
      "|" +
      encodeURIComponent(item.deskripsi);

    if (i === 0) {
      stringData += baris;
    } else {
      stringData += ";;" + baris;
    }
  }
  localStorage.setItem(KUNCI_PORTOFOLIO, stringData);
}

function muatSemuaPortofolioTanpaJSON() {
  const dataMentah = localStorage.getItem(KUNCI_PORTOFOLIO);
  if (!dataMentah) {
    return dataAwalDefault;
  }

  const hasil = [];
  const barisBaris = dataMentah.split(";;");

  for (let i = 0; i < barisBaris.length; i++) {
    if (barisBaris[i] === "") continue;
    const bagian = barisBaris[i].split("|");
    if (bagian.length === 3) {
      hasil.push({
        id: Number(bagian[0]),
        judul: decodeURIComponent(bagian[1]),
        deskripsi: decodeURIComponent(bagian[2]),
      });
    }
  }
  return hasil;
}

let portfolioData = muatSemuaPortofolioTanpaJSON();

function renderPortfolio() {
  if (!container) return;
  if (portfolioData.length === 0) {
    container.innerHTML =
      "<p style='font-style: italic; color: #888;'>Belum ada item portofolio saat ini.</p>";
    return;
  }

  let htmlKonten = "";
  for (let i = 0; i < portfolioData.length; i++) {
    const item = portfolioData[i];
    const jumlahLike = localStorage.getItem(AWALAN_LIKE + item.id) || "0";

    htmlKonten += `
      <div class="portfolio-item" data-id="${item.id}">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <div class="portfolio-actions" style="margin-top: 10px; display: flex; gap: 10px;">
              <button class="btn-like-portfolio" data-id="${item.id}">Like (${jumlahLike})</button>
              <button class="btn-hapus">Hapus</button>
          </div>
      </div>
    `;
  }
  container.innerHTML = htmlKonten;
}

const btnSimpan = document.getElementById("btn-simpan");
if (btnSimpan) {
  btnSimpan.addEventListener("click", () => {
    const inputJudul = document.getElementById("input-judul");
    const inputDeskripsi = document.getElementById("input-deskripsi");

    const judulValue = inputJudul.value.trim();
    const deskripsiValue = inputDeskripsi.value.trim();

    if (judulValue !== "" && deskripsiValue !== "") {
      const newItem = {
        id: Date.now(),
        judul: judulValue,
        deskripsi: deskripsiValue,
      };
      portfolioData.push(newItem);
      simpanSemuaPortofolioTanpaJSON();
      renderPortfolio();
      inputJudul.value = "";
      inputDeskripsi.value = "";
    } else {
      alert("Mohon isi Judul dan Deskripsi terlebih dahulu!");
    }
  });
}

if (container) {
  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-hapus")) {
      const itemElement = event.target.closest(".portfolio-item");
      const idHapus = parseInt(itemElement.getAttribute("data-id"));

      const hasilFilter = [];
      for (let i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i].id !== idHapus) {
          hasilFilter.push(portfolioData[i]);
        }
      }
      portfolioData = hasilFilter;
      simpanSemuaPortofolioTanpaJSON();

      localStorage.removeItem(AWALAN_LIKE + idHapus);
      renderPortfolio();
    }

    if (event.target.classList.contains("btn-like-portfolio")) {
      const idLike = event.target.getAttribute("data-id");
      let jumlah = parseInt(localStorage.getItem(AWALAN_LIKE + idLike) || 0);
      jumlah++;

      localStorage.setItem(AWALAN_LIKE + idLike, String(jumlah));
      event.target.textContent = `Like (${jumlah})`;
    }
  });
}

const toggleBtn = document.getElementById("dark-mode-toggle");

function toggleDarkMode() {
  const gelap = document.body.classList.toggle("dark-mode");
  localStorage.setItem("tema", gelap ? "dark" : "light");
}

function muatPrefrensiTema() {
  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
  }
}
muatPrefrensiTema();

if (toggleBtn) {
  toggleBtn.addEventListener("click", toggleDarkMode);
}

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key.toLowerCase() === "a") {
    toggleDarkMode();
  }
});

const infoAside = document.getElementById("aside-info");
const tombolAside = document.getElementById("btn-aside");

function StatusAside(tersembunyi) {
  if (!infoAside || !tombolAside) return;
  infoAside.hidden = tersembunyi;
  tombolAside.textContent = tersembunyi
    ? "Tampilkan Aside"
    : "Sembunyikan Aside";
  tombolAside.setAttribute("aria-expanded", String(!tersembunyi));
}

function muatStatusAside() {
  const tersimpan = localStorage.getItem("asideTersembunyi");
  StatusAside(tersimpan === "true");
}

if (infoAside && tombolAside) {
  muatStatusAside();

  tombolAside.addEventListener("click", () => {
    const tersembunyiBaru = !infoAside.hidden;
    StatusAside(tersembunyiBaru);
    localStorage.setItem("asideTersembunyi", String(tersembunyiBaru));
  });
}
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const AWALAN_KUNCI = "komentar-";

function simpanSatuKomentar(k) {
  const nilai = encodeURIComponent(k.nama) + "|" + encodeURIComponent(k.pesan);
  localStorage.setItem(AWALAN_KUNCI + k.id, nilai);
}

function hapusSatuKomentar(id) {
  localStorage.removeItem(AWALAN_KUNCI + id);
}

function muatKomentar() {
  const hasil = [];
  for (let i = 0; i < localStorage.length; i++) {
    const kunci = localStorage.key(i);
    if (!kunci.startsWith(AWALAN_KUNCI)) continue;

    const id = Number(kunci.slice(AWALAN_KUNCI.length));
    const bagian = localStorage.getItem(kunci).split("|");
    if (Number.isNaN(id) || bagian.length !== 2) continue;

    try {
      hasil.push({
        id,
        nama: decodeURIComponent(bagian[0]),
        pesan: decodeURIComponent(bagian[1]),
      });
    } catch {}
  }
  return hasil.sort((a, b) => a.id - b.id);
}

let dataKomentar = muatKomentar();

function buatItemKomentar(k) {
  const li = document.createElement("li");
  li.dataset.id = k.id;

  const nama = document.createElement("strong");
  nama.textContent = k.nama;
  li.appendChild(nama);

  if (k.dariAPI) {
    li.classList.add("komentar-api");
    const email = document.createElement("small");
    email.className = "komentar-email";
    email.textContent = k.email;
    li.appendChild(email);
  }

  const pesan = document.createElement("p");
  pesan.textContent = k.pesan;
  li.appendChild(pesan);

  // Komentar dari API bersifat awal (read-only), jadi tanpa tombol hapus
  if (!k.dariAPI) {
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus-komentar";
    tombolHapus.textContent = "Hapus";
    li.appendChild(tombolHapus);
  }
  return li;
}

function renderKomentar() {
  daftarKomentar.innerHTML = "";
  komentarAPI.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
  dataKomentar.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
}

/* ====== Fetch komentar awal dari API ====== */
const URL_KOMENTAR_API = "https://jsonplaceholder.typicode.com/posts/1/comments";
const statusKomentar = document.querySelector("#status-komentar");
let komentarAPI = [];

function tampilkanLoading() {
  statusKomentar.innerHTML = `
    <div class="loading-wrapper">
      <span class="spinner" role="status" aria-label="Memuat komentar"></span>
      <span>Memuat komentar...</span>
    </div>`;
}

function tampilkanError(pesan) {
  statusKomentar.innerHTML = "";
  const kotak = document.createElement("div");
  kotak.className = "pesan-error";
  kotak.setAttribute("role", "alert");

  const teks = document.createElement("span");
  teks.textContent = pesan;

  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "btn-coba-lagi";
  tombol.textContent = "Coba Lagi";

  kotak.append(teks, tombol);
  statusKomentar.appendChild(kotak);
}

async function ambilKomentarAwal() {
  tampilkanLoading();
  const pengendali = new AbortController();
  const timer = setTimeout(() => pengendali.abort(), 10000); // batas waktu 10 detik

  try {
    const respons = await fetch(URL_KOMENTAR_API, { signal: pengendali.signal });
    if (!respons.ok) {
      throw new Error(`HTTP_${respons.status}`);
    }

    const data = await respons.json();
    if (!Array.isArray(data)) {
      throw new Error("FORMAT_SALAH");
    }

    komentarAPI = data.map((c) => ({
      id: "api-" + c.id,
      nama: c.name,
      email: c.email,
      pesan: c.body,
      dariAPI: true,
    }));

    statusKomentar.innerHTML = "";
    renderKomentar();
  } catch (err) {
    let pesan;
    if (err.name === "AbortError") {
      pesan = "Permintaan terlalu lama (lebih dari 10 detik). Silakan coba lagi.";
    } else if (err instanceof TypeError) {
      pesan = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.";
    } else if (err.message.startsWith("HTTP_")) {
      pesan = `Server bermasalah (kode ${err.message.slice(5)}). Komentar belum dapat dimuat.`;
    } else if (err instanceof SyntaxError || err.message === "FORMAT_SALAH") {
      pesan = "Data komentar dari server tidak valid. Silakan coba lagi nanti.";
    } else {
      pesan = "Terjadi kesalahan saat memuat komentar. Silakan coba lagi.";
    }
    tampilkanError(pesan);
    renderKomentar(); // tetap tampilkan komentar lokal
  } finally {
    clearTimeout(timer);
  }
}

if (formKomentar && daftarKomentar) {
  const inputNama = document.querySelector("#input-nama");
  const inputPesan = document.querySelector("#input-pesan");

  inputNama.value = sessionStorage.getItem("draftNama") || "";
  inputPesan.value = sessionStorage.getItem("draftPesan") || "";

  inputNama.addEventListener("input", () => {
    sessionStorage.setItem("draftNama", inputNama.value);
  });
  inputPesan.addEventListener("input", () => {
    sessionStorage.setItem("draftPesan", inputPesan.value);
  });

  formKomentar.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama === "" || pesan === "") {
      alert("Nama dan komentar wajib diisi!");
      return;
    }

    const komentarBaru = { id: Date.now(), nama, pesan };
    dataKomentar.push(komentarBaru);
    simpanSatuKomentar(komentarBaru);
    renderKomentar();
    formKomentar.reset();
    sessionStorage.removeItem("draftNama");
    sessionStorage.removeItem("draftPesan");
  });

  daftarKomentar.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-hapus-komentar")) return;

    const id = Number(e.target.closest("li").dataset.id);
    dataKomentar = dataKomentar.filter((k) => k.id !== id);
    hapusSatuKomentar(id);
    renderKomentar();
  });

  renderPortfolio();

  renderKomentar();
  ambilKomentarAwal();
  statusKomentar.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-coba-lagi")) ambilKomentarAwal();
  });

  const btnReset = document.getElementById("btn-reset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Hapus semua data tersimpan ?")) {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
      }
    });
  }
}
