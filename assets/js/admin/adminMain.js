import { renderSidebar } from "./sidebar.js";

import { fazerLogin, fazerLogout } from "./auth/login.js";

import {
  pegarSessao,
  limparSessao
} from "./auth/session.js";

const app = document.getElementById("adminApp");

let usuarioAtual = null;

function renderLogin() {
  app.innerHTML = `
    <section class="admin-login">
      <div class="admin-login-card">
        <img src="/assets/images/logo-vertical.png">

        <h1>Entrar na Área ADM</h1>

        <p>Digite suas credenciais para acessar.</p>

        <label>E-mail</label>
        <input id="loginEmail" type="email" placeholder="Digite seu e-mail">

        <label>Senha</label>
        <input id="loginSenha" type="password" placeholder="Digite sua senha">

        <button id="loginBtn" class="btn btn-gradient">
          Entrar
        </button>

        <p id="loginErro" class="login-erro"></p>
      </div>
    </section>
  `;

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();

    const resultado = await fazerLogin(email, senha);

    if (!resultado.sucesso) {
      document.getElementById("loginErro").innerText = resultado.mensagem;
      return;
    }

    renderPainel(resultado.usuario);
  };
}

function renderDashboard() {
  document.getElementById("adminPage").innerHTML = `
    <div class="admin-card">
      <h1>Painel de Controle</h1>
      <p>Bem-vindo, ${usuarioAtual.nome || "ADM"}.</p>
      <p>Agora o menu já respeita as permissões do usuário logado.</p>
    </div>
  `;
}

function renderPaginaPlaceholder(nome) {
  document.getElementById("adminPage").innerHTML = `
    <div class="admin-card">
      <h1>${nome}</h1>
      <p>Esta área será criada no próximo módulo.</p>
    </div>
  `;
}

function abrirPagina(pagina) {
  if (pagina === "dashboard") {
    renderDashboard();
    return;
  }

  const nomes = {
    novaMateria: "Nova Matéria",
    listarMaterias: "Matérias Publicadas",
    editarPerfil: "Editar Perfil",
    cadastrarAdm: "Cadastrar ADM",
    gerenciarAdms: "Gerenciar ADMs"
  };

  renderPaginaPlaceholder(nomes[pagina] || pagina);
}

function renderPainel(usuario) {
  usuarioAtual = usuario;

  app.innerHTML = `
    <div class="admin-layout">
      ${renderSidebar(usuario)}

      <main class="admin-content">
        <div id="adminPage"></div>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-page]").forEach((botao) => {
    botao.onclick = () => {
      abrirPagina(botao.dataset.page);
    };
  });

  document.getElementById("logoutBtn").onclick = async () => {
    await fazerLogout();
    limparSessao();
    usuarioAtual = null;
    renderLogin();
  };

  renderDashboard();
}

const sessao = pegarSessao();

if (sessao) {
  renderPainel(sessao);
} else {
  renderLogin();
}
