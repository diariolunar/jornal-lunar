export function renderSidebar(usuario = {}) {

  return `
    <aside class="admin-sidebar">

      <div class="admin-logo">
        <img src="/assets/images/logo-diario-lunar2.png">
      </div>

      <div class="admin-user">

        <img
          src="${
            usuario.fotoUrl
            || "/assets/images/logo-vertical.png"
          }"
        >

        <h3>
          ${
            usuario.nome
            || "Administrador"
          }
        </h3>

        <p>
          ${
            usuario.cargo
            || "Equipe Lunar"
          }
        </p>

      </div>

      <div class="admin-menu">

        <button data-page="dashboard">
          Dashboard
        </button>

        <button data-page="novaMateria">
          Nova Matéria
        </button>

        <button data-page="listarMaterias">
          Matérias Publicadas
        </button>

        <button data-page="editarPerfil">
          Editar Perfil
        </button>

        ${
          usuario.superadmin
          ? `
            <button data-page="gerenciarAdms">
              Gerenciar ADMs
            </button>
          `
          : ""
        }

        <button id="logoutBtn">
          Sair
        </button>

      </div>

    </aside>
  `;
}
