import { renderSidebar } from "./sidebar.js";

const usuarioFake = {
  nome: "Super Admin",
  cargo: "Administrador Geral",
  fotoUrl: "/assets/images/logo-vertical.png",
  superadmin: true
};

document.getElementById("adminApp").innerHTML = `
  <div class="admin-layout">

    ${renderSidebar(usuarioFake)}

    <main class="admin-content">

      <div id="adminPage"></div>

    </main>

  </div>
`;

const adminPage =
  document.getElementById("adminPage");

function carregarDashboard() {

  adminPage.innerHTML = `
    <div class="admin-card">

      <h1>
        Bem-vindo ao painel ADM
      </h1>

      <p>
        O novo sistema modular do Diário Lunar
        está funcionando corretamente.
      </p>

    </div>
  `;
}

carregarDashboard();

document
  .querySelectorAll("[data-page]")
  .forEach((botao) => {

    botao.onclick = () => {

      const pagina =
        botao.dataset.page;

      adminPage.innerHTML = `
        <div class="admin-card">

          <h2>
            ${pagina}
          </h2>

          <p>
            Essa área será modularizada separadamente.
          </p>

        </div>
      `;
    };
  });

document.getElementById("logoutBtn").onclick =
  () => {

    alert("Logout futuramente.");
  };
