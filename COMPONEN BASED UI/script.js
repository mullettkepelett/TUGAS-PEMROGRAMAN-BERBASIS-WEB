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

function simpanPortofolio() {
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

function muatPortofolio() {
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

let portfolioData = muatPortofolio();

function buatItemPortfolio(item) {
  const div = document.createElement("div");
  div.className = "portfolio-item";
  div.dataset.id = item.id;

  const judul = document.createElement("h3");
  judul.textContent = item.judul;

  const deskripsi = document.createElement("p");
  deskripsi.textContent = item.deskripsi;

  const aksi = document.createElement("div");
  aksi.className = "portfolio-actions";
  aksi.style.cssText = "margin-top: 10px; display: flex; gap: 10px;";

  const jumlahLike = localStorage.getItem(AWALAN_LIKE + item.id) || "0";
  const btnLike = document.createElement("button");
  btnLike.className = "btn-like-portfolio";
  btnLike.dataset.id = item.id;
  btnLike.textContent = `Like (${jumlahLike})`;

  const btnHapus = document.createElement("button");
  btnHapus.className = "btn-hapus";
  btnHapus.textContent = "Hapus";

  aksi.append(btnLike, btnHapus);
  div.append(judul, deskripsi, aksi);
  return div;
}

function renderPortfolio() {
  if (!container) return;
  container.replaceChildren();

  if (portfolioData.length === 0) {
    const kosong = document.createElement("p");
    kosong.style.cssText = "font-style: italic; color: #888;";
    kosong.textContent = "Belum ada item portofolio saat ini.";
    container.appendChild(kosong);
    return;
  }
  portfolioData.forEach((item) => container.appendChild(buatItemPortfolio(item)));
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
      simpanPortofolio();
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
      simpanPortofolio();

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
  const el = document.createElement("kartu-komentar");
  el.dataset.id = k.id;
  el.setAttribute("nama", k.nama);
  el.setAttribute("pesan", k.pesan);
  if (k.dariAPI) {
    el.setAttribute("email", k.email);
    el.setAttribute("api", "");
  }
  return el;
}

function renderKomentar() {
  daftarKomentar.replaceChildren();
  komentarAPI.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
  dataKomentar.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
}

const URL_KOMENTAR_API =
  "https://jsonplaceholder.typicode.com/posts/1/comments";
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
  statusKomentar.replaceChildren();
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

function ambilKomentarAwal() {
  tampilkanLoading();
  const pengendali = new AbortController();
  const timer = setTimeout(() => pengendali.abort(), 10000);

  return fetch(URL_KOMENTAR_API, { signal: pengendali.signal })
    .then((respons) => {
      if (!respons.ok) {
        throw new Error(`HTTP_${respons.status}`);
      }
      return respons.json();
    })
    .then((data) => {
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

      statusKomentar.replaceChildren();
      renderKomentar();
    })
    .catch((err) => {
      let pesan;
      if (err.name === "AbortError") {
        pesan = "Permintaan terlalu lama, Silakan coba lagi.";
      } else if (err instanceof TypeError) {
        pesan =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.";
      } else if (err.message.startsWith("HTTP_")) {
        pesan = `Server bermasalah (kode ${err.message.slice(5)}). Komentar belum dapat dimuat.`;
      } else if (err instanceof SyntaxError || err.message === "FORMAT_SALAH") {
        pesan =
          "Data komentar dari server tidak valid. Silakan coba lagi nanti.";
      } else {
        pesan = "Terjadi kesalahan saat memuat komentar. Silakan coba lagi.";
      }
      tampilkanError(pesan);
      renderKomentar();
    })
    .finally(() => {
      clearTimeout(timer);
    });
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

  daftarKomentar.addEventListener("hapus-komentar", (e) => {
    const id = Number(e.detail.id);
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
const wadah = document.querySelector(".daftar-artikel");
async function muatArtikel() {
  if (!wadah) return; 
  wadah.textContent = "Memuat artikel...";
  try {
    const res = await fetch(".../posts?_limit=5");
    if (!res.ok) throw new Error("Status: " + res.status);
    const data = await res.json();
    wadah.replaceChildren();
    data.forEach((post) => {
      const kartu = document.createElement("kartu-artikel");
      kartu.setAttribute("judul", post.title);
      kartu.setAttribute("isi", post.body);
      wadah.appendChild(kartu);
    });
  } catch (error) {
    wadah.textContent = "Gagal memuat artikel, silakan coba lagi.";
    console.error(error);
  }
}
muatArtikel();
