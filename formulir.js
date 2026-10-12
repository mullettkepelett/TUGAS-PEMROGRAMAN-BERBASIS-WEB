const form = document.getElementById("formulir");
const pesan = document.getElementById("pesan");

const pengajuanDpp = document.getElementById("pengajuan-dpp");
const tidakDpp = document.getElementById("surat-tidak-mengajukan");
const dokumenDpp = [
  "gaji-orgtua",
  "bukti-rekening",
  "surat-keterangan-tidak-mampu",
].map(function (id) {
  return document.getElementById(id);
});

const menyumbang = document.getElementById("menyumbang");
const tidakMenyumbang = document.getElementById("tidak-menyumbang");
const jumlahSumbangan = document.getElementById("jumlah-sumbangan");

const nilaiAkreditasi = document.getElementById("nilai-akreditasi");
const radioPilihan = Array.from(
  document.querySelectorAll('input[name^="pilihan-"]'),
);

function tampilkanPesan(teks, sukses) {
  pesan.textContent = teks;
  pesan.hidden = false;
  pesan.classList.toggle("sukses", Boolean(sukses));
  pesan.scrollIntoView({ behavior: "smooth", block: "center" });
}

function sembunyikanPesan() {
  pesan.hidden = true;
  pesan.textContent = "";
}

function bersihkanTanda() {
  document.querySelectorAll(".salah").forEach(function (el) {
    el.classList.remove("salah");
  });
}

function atasDokumenDpp() {
  dokumenDpp.forEach(function (kotak) {
    kotak.disabled = !pengajuanDpp.checked;
    if (!pengajuanDpp.checked) {
      kotak.checked = false;
    }
  });
}

pengajuanDpp.addEventListener("change", function () {
  if (pengajuanDpp.checked) {
    tidakDpp.checked = false;
  }
  atasDokumenDpp();
});

tidakDpp.addEventListener("change", function () {
  if (tidakDpp.checked) {
    pengajuanDpp.checked = false;
  }
  atasDokumenDpp();
});

function atasSumbangan() {
  jumlahSumbangan.disabled = !menyumbang.checked;
  if (!menyumbang.checked) {
    jumlahSumbangan.value = "";
  }
}

menyumbang.addEventListener("change", function () {
  if (menyumbang.checked) {
    tidakMenyumbang.checked = false;
  }
  atasSumbangan();
  if (menyumbang.checked) {
    jumlahSumbangan.focus();
  }
});

tidakMenyumbang.addEventListener("change", function () {
  if (tidakMenyumbang.checked) {
    menyumbang.checked = false;
  }
  atasSumbangan();
});

document
  .querySelectorAll('input[name="status-transfer"]')
  .forEach(function (radio) {
    radio.addEventListener("change", function () {
      const akreditasi = document.getElementById("terakreditasi").checked;
      nilaiAkreditasi.disabled = !akreditasi;
      if (!akreditasi) {
        nilaiAkreditasi.value = "";
      } else {
        nilaiAkreditasi.focus();
      }
    });
  });

function sinkronPilihanProdi() {
  const terpilih = {};
  radioPilihan.forEach(function (radio) {
    if (radio.checked) {
      terpilih[radio.name] = radio.value;
    }
  });

  radioPilihan.forEach(function (radio) {
    const dipakaiDiTempatLain = Object.keys(terpilih).some(function (nama) {
      return nama !== radio.name && terpilih[nama] === radio.value;
    });
    radio.disabled = dipakaiDiTempatLain;
  });
}

radioPilihan.forEach(function (radio) {
  radio.addEventListener("change", sinkronPilihanProdi);
});

["telepon-rumah", "no-hp", "telepon-sekolah"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9+\-\s()]/g, "");
  });
});

function terpilih(nama) {
  return form.querySelector('input[name="' + nama + '"]:checked');
}

function terisi(id) {
  return document.getElementById(id).value.trim() !== "";
}

function periksa() {
  const aturan = [
    {
      ok: terisi("nama-lengkap"),
      el: "nama-lengkap",
      teks: "Nama lengkap wajib diisi.",
    },
    {
      ok: terpilih("jenis-kelamin"),
      el: "perempuan",
      teks: "Pilih jenis kelamin.",
    },
    { ok: terpilih("status"), el: "belum-menikah", teks: "Pilih status." },
    { ok: terpilih("agama"), el: "islam", teks: "Pilih agama." },
    {
      ok: terpilih("kewarganegaraan"),
      el: "wni",
      teks: "Pilih kewarganegaraan.",
    },
    {
      ok: terisi("alamat-surat"),
      el: "alamat-surat",
      teks: "Alamat surat wajib diisi.",
    },
    {
      ok: terisi("alamat-asal"),
      el: "alamat-asal",
      teks: "Alamat asal wajib diisi.",
    },
    {
      ok: terisi("kabupaten-kota"),
      el: "kabupaten-kota",
      teks: "Kabupaten/Kota wajib diisi.",
    },
    { ok: terisi("provinsi"), el: "provinsi", teks: "Propinsi wajib diisi." },
    {
      ok: terisi("telepon-rumah") || terisi("no-hp"),
      el: "no-hp",
      teks: "Isi minimal satu nomor telepon rumah atau HP.",
    },
    {
      ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        document.getElementById("email").value.trim(),
      ),
      el: "email",
      teks: "Alamat e-mail tidak valid.",
    },
    {
      ok: terisi("nama-orangtua"),
      el: "nama-orangtua",
      teks: "Nama orang tua/wali wajib diisi.",
    },
    {
      ok: terpilih("pendidikan"),
      el: "tidak-lulus-sd",
      teks: "Pilih tingkat pendidikan orang tua/wali.",
    },
    {
      ok:
        !document.getElementById("terakreditasi").checked ||
        terisi("nilai-akreditasi"),
      el: "nilai-akreditasi",
      teks: "Isi nilai akreditasi perguruan tinggi asal.",
    },
    {
      ok: terpilih("pilihan-1"),
      el: "pgsd-1",
      teks: "Pilihan I program studi wajib dipilih.",
    },
    {
      ok: !terpilih("pilihan-3") || terpilih("pilihan-2"),
      el: "pgsd-2",
      teks: "Pilihan II harus diisi sebelum Pilihan III.",
    },
    {
      ok: terisi("nama-sekolah"),
      el: "nama-sekolah",
      teks: "Nama sekolah menengah wajib diisi.",
    },
    {
      ok: terisi("alamat-sekolah"),
      el: "alamat-sekolah",
      teks: "Alamat sekolah wajib diisi.",
    },
    {
      ok: terisi("kabupaten-kota-sekolah"),
      el: "kabupaten-kota-sekolah",
      teks: "Kabupaten/Kota sekolah wajib diisi.",
    },
    {
      ok: terisi("provinsi-sekolah"),
      el: "provinsi-sekolah",
      teks: "Propinsi sekolah wajib diisi.",
    },
    {
      ok: terisi("data-tahun"),
      el: "data-tahun",
      teks: "Tahun NEM/STK/SKHUN wajib diisi.",
    },
    {
      ok: terisi("jumlah-nilai"),
      el: "jumlah-nilai",
      teks: "Jumlah nilai wajib diisi.",
    },
    {
      ok: terisi("jumlah-mata-pelajaran"),
      el: "jumlah-mata-pelajaran",
      teks: "Jumlah mata pelajaran wajib diisi.",
    },
    {
      ok: terpilih("jurusan"),
      el: "jurusan-ipa-negeri",
      teks: "Pilih jurusan dan status sekolah (Negeri/Swasta).",
    },
    {
      ok: pengajuanDpp.checked || tidakDpp.checked,
      el: "pengajuan-dpp",
      teks: "Pilih salah satu pernyataan pada bagian Permohonan Keringanan DPP.",
    },
    {
      ok:
        !pengajuanDpp.checked ||
        dokumenDpp.some(function (k) {
          return k.checked;
        }),
      el: "gaji-orgtua",
      teks: "Centang minimal satu dokumen kelengkapan DPP.",
    },
    {
      ok: menyumbang.checked || tidakMenyumbang.checked,
      el: "menyumbang",
      teks: "Pilih salah satu pernyataan pada bagian Partisipasi Program Beasiswa.",
    },
    {
      ok: !menyumbang.checked || Number(jumlahSumbangan.value) > 0,
      el: "jumlah-sumbangan",
      teks: "Isi jumlah sumbangan yang lebih dari 0.",
    },
    {
      ok: terisi("nama-tanda-tangan"),
      el: "nama-tanda-tangan",
      teks: "Nama calon mahasiswa pada bagian tanda tangan wajib diisi.",
    },
  ];

  for (let i = 0; i < aturan.length; i++) {
    if (!aturan[i].ok) {
      return aturan[i];
    }
  }
  return null;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanTanda();
  sembunyikanPesan();

  const galat = periksa();
  if (galat) {
    const target = document.getElementById(galat.el);
    target.classList.add("salah");
    tampilkanPesan(galat.teks, false);
    target.focus({ preventScroll: true });
    return;
  }

  const data = {};
  new FormData(form).forEach(function (nilai, kunci) {
    data[kunci] = nilai;
  });
  console.log(data);
  tampilkanPesan(
    "Formulir berhasil dikirim. Terima kasih, " + data["nama-lengkap"] + ".",
    true,
  );
});

form.addEventListener("input", function (e) {
  e.target.classList.remove("salah");
  if (!pesan.classList.contains("sukses")) {
    sembunyikanPesan();
  }
});

form.addEventListener("reset", function () {
  setTimeout(function () {
    bersihkanTanda();
    sembunyikanPesan();
    atasDokumenDpp();
    atasSumbangan();
    nilaiAkreditasi.disabled = true;
    sinkronPilihanProdi();
  }, 0);
});

atasDokumenDpp();
atasSumbangan();
sinkronPilihanProdi();
