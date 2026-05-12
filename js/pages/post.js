import { db } from "../config/firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { renderNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";

document.getElementById("navbar").innerHTML = renderNavbar();
document.getElementById("footer").innerHTML = renderFooter();

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("id");

const inputUsuario =
  document.getElementById("usuarioWattpad");

const usuarioSalvo =
  localStorage.getItem("usuarioWattpad");

if (usuarioSalvo) {
  inputUsuario.value = usuarioSalvo;
}

document.getElementById("salvarUsuarioBtn").onclick =
  function () {

    const usuario = inputUsuario.value.trim();

    if (!usuario) {
      alert("Digite seu usuário do Wattpad.");
      return;
    }

    localStorage.setItem("usuarioWattpad", usuario);

    alert("Usuário salvo!");

    carregarComentarios();
    verificarCurtida();
  };

function pegarUsuario() {
  const usuario = inputUsuario.value.trim();

  if (!usuario) {
    alert("Digite seu usuário do Wattpad antes.");
    return null;
  }

  localStorage.setItem("usuarioWattpad", usuario);

  return usuario
    .toLowerCase()
    .replaceAll(" ", "");
}

function formatarData(data) {

  if (!data) return "";

  try {

    if (data.toDate) {
      return data
        .toDate()
        .toLocaleDateString("pt-BR");
    }

    return new Date(data)
      .toLocaleDateString("pt-BR");

  } catch {
    return "";
  }
}

function mostrarMateriaNaoEncontrada() {

  document.querySelector(".post-container").innerHTML = `
    <div class="card" style="padding:35px; margin-top:25px;">
      <h1>Matéria não encontrada</h1>

      <p>
        Essa matéria não está disponível publicamente.
      </p>

      <a href="/materias.html" class="btn">
        Ver matérias publicadas
      </a>
    </div>
  `;
}

async function buscarReporter(userAutor) {

  const snapshot =
    await getDocs(collection(db, "admins"));

  let reporter = null;

  snapshot.forEach((item) => {

    const adm = item.data();

    if (
      adm.user &&
      userAutor &&
      adm.user.toLowerCase()
      === userAutor.toLowerCase()
    ) {

      reporter = adm;
    }
  });

  return reporter;
}

async function carregarPost() {

  if (!id) {
    mostrarMateriaNaoEncontrada();
    return;
  }

  const postRef = doc(db, "posts", id);

  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    mostrarMateriaNaoEncontrada();
    return;
  }

  const post = postSnap.data();

  if (
    post.status &&
    post.status !== "publicado"
  ) {

    mostrarMateriaNaoEncontrada();
    return;
  }

  document.getElementById("titulo").innerText =
    post.titulo || "";

  document.getElementById("categoria").innerText =
    post.categoria || "";

  document.getElementById("imagem").src =
    post.imagem || "/assets/images/footer.png";

  document.getElementById("conteudo").innerHTML =
    post.conteudo || "";

  document.getElementById("curtidas").innerText =
    post.curtidas || 0;

  const autorUser =
    post.autor || "diario_lunar";

  const reporter =
    await buscarReporter(autorUser);

  document.getElementById("autorUser").innerText =
    "@" + autorUser;

  if (reporter && reporter.reporter !== false) {

    document.getElementById("fotoReporter").src =
      reporter.fotoUrl
      || "/assets/images/logo-vertical.png";

    let identificacao = "";

    if (reporter.nomenclatura) {
      identificacao +=
        `(${reporter.nomenclatura})`;
    }

    if (reporter.cargo) {

      identificacao +=
        reporter.nomenclatura
        ? ` · ${reporter.cargo}`
        : reporter.cargo;
    }

    document.getElementById(
      "autorNomenclatura"
    ).innerText = identificacao;

  } else {

    document.getElementById("fotoReporter").src =
      "/assets/images/logo-vertical.png";

    document.getElementById(
      "autorNomenclatura"
    ).innerText = "";
  }

  const dataFormatada =
    formatarData(post.data);

  document.getElementById(
    "dataPublicacaoTexto"
  ).innerText =
    dataFormatada
      ? `Publicado em ${dataFormatada}`
      : "";

  verificarCurtida();
}

async function verificarCurtida() {

  const usuario = inputUsuario.value
    .trim()
    .toLowerCase()
    .replaceAll(" ", "");

  if (!usuario || !id) return;

  const likeId = `${id}_${usuario}`;

  const likeRef = doc(db, "likes", likeId);

  const likeSnap = await getDoc(likeRef);

  const total =
    document.getElementById("curtidas")
    .innerText || 0;

  if (likeSnap.exists()) {

    document.getElementById(
      "curtirBtn"
    ).innerHTML =
      `💜 Curtido (<span id="curtidas">${total}</span>)`;

  } else {

    document.getElementById(
      "curtirBtn"
    ).innerHTML =
      `❤️ Curtir (<span id="curtidas">${total}</span>)`;
  }
}

async function curtir() {

  const usuario = pegarUsuario();

  if (!usuario) return;

  const likeId = `${id}_${usuario}`;

  const likeRef = doc(db, "likes", likeId);

  const likeSnap = await getDoc(likeRef);

  const postRef = doc(db, "posts", id);

  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const post = postSnap.data();

  if (
    post.status &&
    post.status !== "publicado"
  ) {

    alert(
      "Essa matéria não está disponível para interação."
    );

    return;
  }

  let atual = post.curtidas || 0;

  if (likeSnap.exists()) {

    await deleteDoc(likeRef);

    const novoTotal =
      Math.max(atual - 1, 0);

    await updateDoc(postRef, {
      curtidas: novoTotal
    });

    document.getElementById(
      "curtidas"
    ).innerText = novoTotal;

    document.getElementById(
      "curtirBtn"
    ).innerHTML =
      `❤️ Curtir (<span id="curtidas">${novoTotal}</span>)`;

    return;
  }

  await setDoc(likeRef, {
    postId: id,
    usuario: usuario,
    data: new Date()
  });

  await updateDoc(postRef, {
    curtidas: atual + 1
  });

  document.getElementById(
    "curtidas"
  ).innerText = atual + 1;

  document.getElementById(
    "curtirBtn"
  ).innerHTML =
    `💜 Curtido (<span id="curtidas">${atual + 1}</span>)`;
}

async function comentar() {

  const usuario = pegarUsuario();

  if (!usuario) return;

  const postRef = doc(db, "posts", id);

  const postSnap = await getDoc(postRef);

  if (
    !postSnap.exists()
    ||
    (
      postSnap.data().status
      &&
      postSnap.data().status !== "publicado"
    )
  ) {

    alert(
      "Essa matéria não está disponível para comentários."
    );

    return;
  }

  const texto =
    document.getElementById("comentarioInput")
    .value
    .trim();

  if (!texto) {
    alert("Escreva um comentário.");
    return;
  }

  await addDoc(collection(db, "comentarios"), {
    postId: id,
    usuario: usuario,
    texto: texto,
    data: new Date()
  });

  document.getElementById(
    "comentarioInput"
  ).value = "";

  carregarComentarios();
}

async function carregarComentarios() {

  const usuarioAtual = inputUsuario.value
    .trim()
    .toLowerCase()
    .replaceAll(" ", "");

  const snapshot =
    await getDocs(collection(db, "comentarios"));

  const container =
    document.getElementById("listaComentarios");

  container.innerHTML = "";

  snapshot.forEach((item) => {

    const c = item.data();

    if (c.postId === id) {

      const div = document.createElement("div");

      div.className = "comentario";

      let botaoExcluir = "";

      if (
        usuarioAtual &&
        c.usuario === usuarioAtual
      ) {

        botaoExcluir = `
          <button
            onclick="apagarComentario('${item.id}')"
            class="btn"
            style="margin-top:8px;"
          >
            Apagar comentário
          </button>
        `;
      }

      div.innerHTML = `
        <strong style="color: var(--roxo);">
          @${c.usuario}
        </strong>

        <p style="margin:8px 0 0;">
          ${c.texto}
        </p>

        ${botaoExcluir}
      `;

      container.appendChild(div);
    }
  });
}

window.apagarComentario =
  async function (comentarioId) {

    const confirmar =
      confirm("Deseja apagar este comentário?");

    if (!confirmar) return;

    await deleteDoc(
      doc(db, "comentarios", comentarioId)
    );

    carregarComentarios();
  };

document.getElementById("curtirBtn").onclick =
  curtir;

document.getElementById("comentarBtn").onclick =
  comentar;

carregarPost();
carregarComentarios();
