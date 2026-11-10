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
const URL_BASIS_API = "https://jsonplaceholder.typicode.com";
const BATAS_ID_KOMENTAR_SERVER = 500;
const BATAS_ID_POST_SERVER = 100;

function pesanDariStatus(status) {
  if (status === undefined) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}

function buatErrorHttp(status) {
  const error = new Error("Status: " + status);
  error.status = status;
  return error;
}

function idSimulasi(id, batas) {
  const angka = Number(id);
  return angka >= 1 && angka <= batas ? angka : 1;
}

function aturSibuk(tombol, sibuk, teksSibuk) {
  if (!tombol) return;
  if (sibuk) {
    tombol.dataset.teksAsal = tombol.textContent;
    tombol.textContent = teksSibuk;
    tombol.disabled = true;
  } else {
    if (tombol.dataset.teksAsal !== undefined) {
      tombol.textContent = tombol.dataset.teksAsal;
      delete tombol.dataset.teksAsal;
    }
    tombol.disabled = false;
  }
}

function kunciTombolItem(li, terkunci) {
  li.querySelectorAll("button").forEach((tombol) => {
    tombol.disabled = terkunci;
  });
}

async function perbaruiLikeKeServer(postId, jumlahLike) {
  const response = await fetch(
    `${URL_BASIS_API}/posts/${idSimulasi(postId, BATAS_ID_POST_SERVER)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: jumlahLike }),
    },
  );
  if (!response.ok) {
    throw buatErrorHttp(response.status);
  }
  return await response.json();
}
async function daftarkanAkunKeServer(nama, email) {
  const response = await fetch(`${URL_BASIS_API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, email: email }),
  });
  if (!response.ok) {
    throw buatErrorHttp(response.status);
  }
  return await response.json();
}

async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(`${URL_BASIS_API}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
  });
  if (!response.ok) {
    throw buatErrorHttp(response.status);
  }
  return await response.json();
}

async function perbaruiKomentarKeServer(serverId, nama, pesan) {
  const response = await fetch(
    `${URL_BASIS_API}/comments/${idSimulasi(serverId, BATAS_ID_KOMENTAR_SERVER)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nama, body: pesan }),
    },
  );
  if (!response.ok) {
    throw buatErrorHttp(response.status);
  }
  return await response.json();
}

async function hapusKomentarDariServer(serverId) {
  const response = await fetch(
    `${URL_BASIS_API}/comments/${idSimulasi(serverId, BATAS_ID_KOMENTAR_SERVER)}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throw buatErrorHttp(response.status);
  }
}


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
  container.addEventListener("click", async (event) => {
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
      const tombolLike = event.target;
      if (tombolLike.disabled) return;

      const idLike = tombolLike.getAttribute("data-id");
      const jumlahBaru =
        parseInt(localStorage.getItem(AWALAN_LIKE + idLike) || 0) + 1;

      aturSibuk(tombolLike, true, "Menyimpan...");
      try {
        await perbaruiLikeKeServer(idLike, jumlahBaru);
        localStorage.setItem(AWALAN_LIKE + idLike, String(jumlahBaru));
        renderPortfolio();
      } catch (error) {
        alert(pesanDariStatus(error.status));
        console.error(error);
      } finally {
        aturSibuk(tombolLike, false);
      }
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
  const serverId =
    k.serverId === null || k.serverId === undefined ? "" : k.serverId;
  const nilai =
    encodeURIComponent(k.nama) +
    "|" +
    encodeURIComponent(k.pesan) +
    "|" +
    serverId;
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
    if (Number.isNaN(id) || bagian.length < 2 || bagian.length > 3) continue;

    try {
      hasil.push({
        id,
        nama: decodeURIComponent(bagian[0]),
        pesan: decodeURIComponent(bagian[1]),
        serverId: bagian[2] ? Number(bagian[2]) : null,
      });
    } catch {}
  }
  return hasil.sort((a, b) => a.id - b.id);
}

let dataKomentar = muatKomentar();
let idSedangDiedit = null;

function buatItemKomentar(k) {
  const li = document.createElement("li");
  li.dataset.id = k.id;

  if (k.id === idSedangDiedit) {
    li.classList.add("sedang-diedit");
  }

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

  if (!k.dariAPI) {
    li.dataset.serverId =
      k.serverId === null || k.serverId === undefined ? "" : k.serverId;

    const aksi = document.createElement("div");
    aksi.className = "aksi-komentar";

    const tombolEdit = document.createElement("button");
    tombolEdit.type = "button";
    tombolEdit.className = "btn-edit-komentar";
    tombolEdit.textContent = "Edit";
    aksi.appendChild(tombolEdit);

    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus-komentar";
    tombolHapus.textContent = "Hapus";
    aksi.appendChild(tombolHapus);

    li.appendChild(aksi);
  }
  return li;
}

function renderKomentar() {
  daftarKomentar.innerHTML = "";
  komentarAPI.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
  dataKomentar.forEach((k) => daftarKomentar.appendChild(buatItemKomentar(k)));
}

const URL_KOMENTAR_API = `${URL_BASIS_API}/posts/1/comments`;
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

      statusKomentar.innerHTML = "";
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
  const tombolKirim = formKomentar.querySelector('button[type="submit"]');
  const tombolBatal = document.querySelector("#btn-batal-edit");
  let sedangMengirim = false;

  inputNama.value = sessionStorage.getItem("draftNama") || "";
  inputPesan.value = sessionStorage.getItem("draftPesan") || "";

  inputNama.addEventListener("input", () => {
    if (idSedangDiedit === null) {
      sessionStorage.setItem("draftNama", inputNama.value);
    }
  });
  inputPesan.addEventListener("input", () => {
    if (idSedangDiedit === null) {
      sessionStorage.setItem("draftPesan", inputPesan.value);
    }
  });

  function keluarModeEdit() {
    idSedangDiedit = null;
    formKomentar.reset();
    sessionStorage.removeItem("draftNama");
    sessionStorage.removeItem("draftPesan");
    tombolKirim.textContent = "Kirim";
    tombolBatal.hidden = true;
  }

  formKomentar.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sedangMengirim) return;

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama === "" || pesan === "") {
      alert("Nama dan komentar wajib diisi!");
      return;
    }

    const modeEdit = idSedangDiedit !== null;
    sedangMengirim = true;
    aturSibuk(tombolKirim, true, modeEdit ? "Menyimpan..." : "Mengirim...");
    tombolBatal.disabled = true;

    try {
      if (modeEdit) {
        const target = dataKomentar.find((k) => k.id === idSedangDiedit);
        const hasil = await perbaruiKomentarKeServer(
          target.serverId,
          nama,
          pesan,
        );
        target.nama = hasil.name || nama;
        target.pesan = hasil.body || pesan;
        simpanSatuKomentar(target);
      } else {
        const hasil = await kirimKomentarKeServer(nama, pesan);
        const komentarBaru = {
          id: Date.now(),
          nama: hasil.name,
          pesan: hasil.body,
          serverId: hasil.id,
        };
        dataKomentar.push(komentarBaru);
        simpanSatuKomentar(komentarBaru);
      }
      keluarModeEdit();
      renderKomentar();
    } catch (error) {
      alert(pesanDariStatus(error.status));
      console.error(error);
    } finally {
      aturSibuk(tombolKirim, false);
      tombolKirim.textContent =
        idSedangDiedit === null ? "Kirim" : "Simpan Perubahan";
      tombolBatal.disabled = false;
      sedangMengirim = false;
    }
  });

  tombolBatal.addEventListener("click", () => {
    if (sedangMengirim) return;
    keluarModeEdit();
    renderKomentar();
  });

  daftarKomentar.addEventListener("click", async (e) => {
    const tombol = e.target;
    const adalahEdit = tombol.classList.contains("btn-edit-komentar");
    const adalahHapus = tombol.classList.contains("btn-hapus-komentar");
    if (!adalahEdit && !adalahHapus) return;
    if (tombol.disabled) return;

    const li = tombol.closest("li");
    const id = Number(li.dataset.id);
    const target = dataKomentar.find((k) => k.id === id);
    if (!target) return;

    if (adalahEdit) {
      if (sedangMengirim) return;
      idSedangDiedit = id;
      inputNama.value = target.nama;
      inputPesan.value = target.pesan;
      tombolKirim.textContent = "Simpan Perubahan";
      tombolBatal.hidden = false;
      renderKomentar();
      formKomentar.scrollIntoView({ behavior: "smooth", block: "center" });
      inputPesan.focus();
      return;
    }

    kunciTombolItem(li, true);
    tombol.textContent = "Menghapus...";

    try {
      await hapusKomentarDariServer(target.serverId);
      dataKomentar = dataKomentar.filter((k) => k.id !== id);
      hapusSatuKomentar(id);
      if (idSedangDiedit === id) {
        keluarModeEdit();
      }
      renderKomentar();
    } catch (error) {
      alert(pesanDariStatus(error.status));
      console.error(error);
      kunciTombolItem(li, false);
      tombol.textContent = "Hapus";
    }
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

const formAkun = document.getElementById("form-akun");
const pesanAkun = document.getElementById("pesan");
const daftarErrorAkun = document.getElementById("daftar-error");
const kolomPassword = document.getElementById("password");
const kolomKonfirmasi = document.getElementById("konfirmasi-password");
const cekLihatPassword = document.getElementById("lihat");

function aturTampilPassword(tampil) {
  const tipe = tampil ? "text" : "password";
  kolomPassword.type = tipe;
  kolomKonfirmasi.type = tipe;
  cekLihatPassword.checked = tampil;
}

if (formAkun && pesanAkun && daftarErrorAkun) {
  aturTampilPassword(cekLihatPassword.checked);

  cekLihatPassword.addEventListener("change", () => {
    aturTampilPassword(cekLihatPassword.checked);
  });

  formAkun.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama-akun").value.trim();
    const email = document.getElementById("email");
    const password = kolomPassword.value;
    const konfirmasi = kolomKonfirmasi.value;
    const errors = [];

    daftarErrorAkun.textContent = "";
    pesanAkun.textContent = "";

    if (nama === "") {
      errors.push("Nama lengkap wajib diisi.");
    }

    if (email.value.trim() === "") {
      errors.push("Email wajib diisi.");
    } else if (!email.validity.valid) {
      errors.push("Format email tidak valid.");
    }

    if (password === "") {
      errors.push("Password wajib diisi.");
    } else if (password.length < 6) {
      errors.push("Password minimal 6 karakter.");
    }

    if (konfirmasi === "") {
      errors.push("Konfirmasi password wajib diisi.");
    } else if (password !== "" && password !== konfirmasi) {
      errors.push("Konfirmasi password tidak sama.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        const item = document.createElement("li");
        item.textContent = error;
        daftarErrorAkun.appendChild(item);
      });
      return;
    }

    const tombolDaftar = formAkun.querySelector('button[type="submit"]');
    aturSibuk(tombolDaftar, true, "Mengirim...");

    try {
      const hasil = await daftarkanAkunKeServer(nama, email.value.trim());
      pesanAkun.textContent = "Selamat, pendaftaran kamu berhasil, " + nama + "!!!";
      console.log("Akun tersimpan di API:", hasil);
      formAkun.reset();
      aturTampilPassword(false);
    } catch (error) {
      const item = document.createElement("li");
      item.textContent = pesanDariStatus(error.status);
      daftarErrorAkun.appendChild(item);
      console.error(error);
    } finally {
      aturSibuk(tombolDaftar, false);
    }
  });
}
