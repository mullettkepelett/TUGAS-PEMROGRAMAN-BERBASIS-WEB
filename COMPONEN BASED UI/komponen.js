class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama");
    this.textContent = `Halo, ${nama}! Selamat Datang di Website Pribadi Sandro.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);

class KartuArtikel extends HTMLElement {
  #like = 0;
  static get observedAttributes() {
    return ["judul", "isi", "batas-like"];
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    console.log("kartu-artikel dilepas");
  }
  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }
  get #batas() {
    const n = Number(this.getAttribute("batas-like"));
    return Number.isInteger(n) && n > 0 ? n : Infinity;
  }
  #perbaruiLike(tombol) {
    const penuh = this.#like >= this.#batas;
    tombol.textContent = penuh
      ? `Like (${this.#like}) - batas tercapai`
      : `Like (${this.#like})`;
    tombol.disabled = penuh;
  }
  render() {
    this.innerHTML = `<article class="kartu"><h3></h3><p></p>
      <button class="btn-like"></button>
      <button class="btn-hapus">Hapus</button></article>`;
    this.querySelector("h3").textContent = this.getAttribute("judul") ?? "";
    this.querySelector("p").textContent = this.getAttribute("isi") ?? "";
    const like = this.querySelector(".btn-like");
    this.#perbaruiLike(like);
    like.addEventListener("click", () => {
      if (this.#like >= this.#batas) return;
      this.#like++;
      this.#perbaruiLike(like);
    });
    this.querySelector(".btn-hapus").addEventListener("click", () =>
      this.remove(),
    );
  }
}
customElements.define("kartu-artikel", KartuArtikel);

class KartuKomentar extends HTMLElement {
  static get observedAttributes() {
    return ["nama", "pesan", "email", "api"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }
  render() {
    const dariAPI = this.hasAttribute("api");
    this.classList.toggle("komentar-api", dariAPI);

    const nama = document.createElement("strong");
    nama.textContent = this.getAttribute("nama") ?? "";
    const anak = [nama];

    if (dariAPI) {
      const email = document.createElement("small");
      email.className = "komentar-email";
      email.textContent = this.getAttribute("email") ?? "";
      anak.push(email);
    }

    const pesan = document.createElement("p");
    pesan.textContent = this.getAttribute("pesan") ?? "";
    anak.push(pesan);

    if (!dariAPI) {
      const hapus = document.createElement("button");
      hapus.type = "button";
      hapus.className = "btn-hapus-komentar";
      hapus.textContent = "Hapus";
      hapus.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("hapus-komentar", {
            bubbles: true,
            detail: { id: this.dataset.id },
          }),
        );
      });
      anak.push(hapus);
    }
    this.replaceChildren(...anak);
  }
}
customElements.define("kartu-komentar", KartuKomentar);

class TombolTema extends HTMLElement {
  #tombol;
  #onKey = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key.toLowerCase() === "a") this.#toggle();
  };
  connectedCallback() {
    if (localStorage.getItem("tema") === "dark") {
      document.body.classList.add("dark-mode");
    }
    this.#tombol = document.createElement("button");
    this.#tombol.type = "button";
    this.#tombol.addEventListener("click", () => this.#toggle());
    this.replaceChildren(this.#tombol);
    this.#perbaruiLabel();
    document.addEventListener("keydown", this.#onKey); 
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this.#onKey);
  }
  #toggle() {
    const gelap = document.body.classList.toggle("dark-mode");
    localStorage.setItem("tema", gelap ? "dark" : "light");
    this.#perbaruiLabel();
  }
  #perbaruiLabel() {
    const gelap = document.body.classList.contains("dark-mode");
    this.#tombol.textContent = gelap ? "Light Mode" : "Dark Mode";
  }
}
customElements.define("tombol-tema", TombolTema);
