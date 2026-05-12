import { db } from "../config/firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { renderNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";

document.getElementById("navbar").innerHTML = renderNavbar();
document.getElementById("footer").innerHTML = renderFooter();

function limparTexto(html) {
  let texto = html || "";

  texto = texto
    .replace(/<\/p>/gi, "\n")
    .replace(/<div>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  texto = texto.replace(/<[^>]*>/g, "");

  const area = document.createElement("textarea");
  area.innerHTML = texto;

  return area.value
    .replace(/\n\s*\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cortarTexto(texto, limite) {
  if (!texto) return "";
  return texto.length > limite ? texto.substring(0, limite).trim() + "..." : texto;
}

function getDataNumber(post) {
  if (post.data?.toDate) return post.data.toDate().getTime();
  if (post.data) return new Date(post.data).getTime();
  return 0;
}

function estaPublicado(post) {
  return !post.status || post.status === "publicado";
}

async function carregarMaterias() {
  const snapshot = await getDocs(collection(db, "posts"));
  const container = document.getElementById("posts");

  let posts = [];

  snapshot.forEach((docItem) => {
    const post = docItem.data();

    if (!estaPublicado(post)) return;

    posts.push({
      id: docItem.id,
      ...post,
      dataNum: getDataNumber(post)
    });
  });

  posts.sort((a, b) => b.dataNum - a.dataNum);

  container.innerHTML = "";

  if (posts.length === 0) {
    container.innerHTML = "<p>Nenhuma matéria publicada ainda.</p>";
    return;
  }

  posts.forEach((post) => {
    const texto = limparTexto(post.conteudo || "");

    const card = document.createElement("div");
    card.className = "card post-card";

    card.onclick = () => {
      window.location.href = `/post.html?id=${post.id}`;
    };

    card.innerHTML = `
      <img src="${post.imagem || "/assets/images/footer.png"}">

      <div class="post-card-content">
        <small>${post.categoria || "Matéria"}</small>
        <h3>${post.titulo || ""}</h3>
        <p>${cortarTexto(texto, 120)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

carregarMaterias();
