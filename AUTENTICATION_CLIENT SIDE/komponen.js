const awalan_suka = "kartu-like-";
const templateKartu = document.createElement("template");
templateKartu.innerHTML = `
<style>
  :host { display: block; }
  .kartu {
    border: 1px solid var(--kartu-garis, #ddd);
    border-radius: var(--kartu-radius, 8px);
    background: var(--kartu-latar, transparent);
    color: var(--kartu-teks, inherit);
    padding: 16px;
  }
  ::slotted(h3) { margin: 0 0 8px; }
  h3, p { margin: 0 0 8px; }
  .btn-like {
    margin-top: 12px;
    padding: 6px 14px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
  }
  .btn-like:disabled { background: #94a3b8; cursor: not-allowed; }
</style>
<article class="kartu">
  <slot name="judul"><h3 id="judul">Tanpa judul</h3></slot>
  <slot><p id="isi">Tanpa isi</p></slot>
  <button type="button" class="btn-like" part="tombol-like">Like (0)</button>
</article>`;

class KartuArtikel extends HTMLElement {
  static get observedAttributes() {
    return ["judul", "isi", "batas-like"];
  }

  #like = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKartu.content.cloneNode(true));

    this.shadowRoot.querySelector(".btn-like").addEventListener("click", () => {
      this.#like++;
      this.#perbarui();
      this.dispatchEvent(
        new CustomEvent("suka", {
          detail: { jumlah: this.#like, id: this.kunci },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  get kunci() {
    return (
      this.getAttribute("kartu-id") ||
      this.getAttribute("judul") ||
      this.querySelector('[slot="judul"]')?.textContent.trim() ||
      null
    );
  }

  connectedCallback() {
    if (this.kunci) {
      this.#like = Number(localStorage.getItem(awalan_suka + this.kunci)) || 0;
    }
    this.#perbarui();
  }

  attributeChangedCallback(nama, lama, baru) {
    if (nama === "batas-like") return this.#perbarui();
    const bawaan = { judul: "Tanpa judul", isi: "Tanpa isi" };
    const t = this.shadowRoot.getElementById(nama);
    if (t) t.textContent = baru ?? bawaan[nama];
  }

  #perbarui() {
    const tombol = this.shadowRoot.querySelector(".btn-like");
    tombol.textContent = `Like (${this.#like})`;
    const batas = Number(this.getAttribute("batas-like"));
    tombol.disabled = batas > 0 && this.#like >= batas;
  }
}
customElements.define("kartu-artikel", KartuArtikel);

function buatKartu(post) {
  const kartu = document.createElement("kartu-artikel");
  kartu.setAttribute("kartu-id", "post-" + post.id);
  const judul = document.createElement("h3");
  judul.slot = "judul";
  judul.textContent = post.title;
  const isi = document.createElement("p");
  isi.textContent = post.body;
  kartu.append(judul, isi);
  return kartu;
}

class DaftarArtikel extends HTMLElement {
  async connectedCallback() {
    this.textContent = "Memuat artikel...";
    const batas = Number(this.getAttribute("batas")) || 5;
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${batas}`,
      );
      if (!res.ok) throw new Error("Status: " + res.status);
      const data = await res.json();
      this.replaceChildren(...data.map(buatKartu));
    } catch (error) {
      this.textContent = "Gagal memuat artikel, silakan coba lagi.";
      console.error(error);
    }
  }
}
customElements.define("daftar-artikel", DaftarArtikel);

const templateKomentar = document.createElement("template");
templateKomentar.innerHTML = `
<style>
  :host { display: block; }
  ::slotted([slot="nama"]) { display: block; font-size: 14px; margin-bottom: 4px; }
  ::slotted([slot="email"]) { display: block; font-size: 12px; margin-bottom: 6px; }
  ::slotted([slot="pesan"]) { margin: 0; font-size: 14px; }
  .btn-hapus-komentar {
    margin-top: 10px;
    padding: 4px 10px;
    background: #6b7280;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-hapus-komentar:hover { background: #dc2626; }
  button[hidden] { display: none; }
</style>
<div class="komentar">
  <slot name="nama">Anonim</slot>
  <slot name="email"></slot>
  <slot name="pesan">(tanpa pesan)</slot>
  <button type="button" class="btn-hapus-komentar" part="tombol-hapus">Hapus</button>
</div>`;

class KartuKomentar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKomentar.content.cloneNode(true));

    this.shadowRoot
      .querySelector(".btn-hapus-komentar")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("hapus-komentar", {
            detail: { id: this.dataset.id },
            bubbles: true,
            composed: true,
          }),
        );
      });
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".btn-hapus-komentar").hidden =
      this.hasAttribute("api");
  }
}
customElements.define("kartu-komentar", KartuKomentar);

class TombolTema extends HTMLElement {
  connectedCallback() {
    const tombol = document.createElement("button");
    tombol.type = "button";
    const render = () => {
      tombol.textContent = document.body.classList.contains("dark-mode")
        ? "Mode Terang"
        : "Mode Gelap";
    };
    if (localStorage.getItem("tema") === "gelap") {
      document.body.classList.add("dark-mode");
    }
    tombol.addEventListener("click", () => {
      const gelap = document.body.classList.toggle("dark-mode");
      localStorage.setItem("tema", gelap ? "gelap" : "terang");
      render();
    });
    render();
    this.replaceChildren(tombol);
  }
}
customElements.define("tombol-tema", TombolTema);

class SalamPengguna extends HTMLElement {
  static get observedAttributes() {
    return ["nama"];
  }
  attributeChangedCallback(nama, lama, baru) {
    this.textContent = `Halo, ${baru || "Tamu"}! Selamat datang di halaman ini.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);
