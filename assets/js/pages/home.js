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

  texto = area.value;

  return texto
    .replace(/\n\s*\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cortarTexto(texto, limite) {
  if (!texto) return "";

  if (texto.length <= limite) {
    return texto;
  }

  return texto.substring(0, limite).trim() + "...";
}

function getDataNumber(post) {
  if (post.data?.toDate) {
    return post.data.toDate().getTime();
  }

  if (post.data) {
    return new Date(post.data).getTime();
  }

  return 0;
}

function estaPublicado(post) {
  return !post.status || post.status === "publicado";
}

async function carregarPosts() {
  const snapshot = await getDocs(collection(db, "posts"));

  const container = document.getElementById("posts");

  let listaPosts = [];

  snapshot.forEach((docItem) => {
    const post = docItem.data();

    if (!estaPublicado(post)) {
      return;
    }

    listaPosts.push({
      id: docItem.id,
      ...post,
      dataNum: getDataNumber(post)
    });
  });

  listaPosts.sort((a, b) => b.dataNum - a.dataNum);

  if (listaPosts.length === 0) {
    document.getElementById("heroTitulo").innerText =
      "Nenhuma matéria publicada ainda";

    document.getElementById("heroResumo").innerText =
      "Publique a primeira matéria pelo painel ADM.";

    return;
  }

  const destaque = listaPosts[0];

  const textoDestaque = limparTexto(destaque.conteudo);

  document.getElementById("heroImagem").src =
    destaque.imagem || "/assets/images/footer.png";

  document.getElementById("heroCategoria").innerText =
    destaque.categoria || "Matéria";

  document.getElementById("heroTitulo").innerText =
    destaque.titulo || "";

  document.getElementById("heroResumo").innerText =
    cortarTexto(textoDestaque, 160);

  document.getElementById("heroCard").onclick = () => {
    window.location.href = `/post.html?id=${destaque.id}`;
  };

  listaPosts.slice(1, 9).forEach((post) => {
    const textoLimpo = limparTexto(post.conteudo);

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

        <p>${cortarTexto(textoLimpo, 100)}</p>

        <a href="/post.html?id=${post.id}">
          Ler matéria →
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

carregarPosts();
