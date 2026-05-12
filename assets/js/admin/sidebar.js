function pode(usuario, permissao) {
  if (usuario.role === "superadmin") {
    return true;
  }

  return usuario.permissoes?.[permissao] === true;
}

export function renderSidebar(usuario = {}) {
  return `
    <aside class="admin-sidebar">

      <a href="/index.html" class="admin-voltar">
        ← Voltar ao site
      </a>

      <div class="admin-logo">
        <img src="/assets/images/logo-diario-lunar2.png">
      </div>

      <div class="admin-user">
        <img src="${usuario.fotoUrl || "/assets/images/logo-vertical.png"}">

        <h3>${usuario.nome || "Administrador"}</h3>

        <p>@${usuario.user || "admin"}</p>

        <span>
          ${usuario.cargo || "Equipe Lunar"}
        </span>
      </div>

      <div class="admin-menu">

        <button data-page="dashboard">
          Painel
        </button>

        ${
          pode(usuario, "publicar")
            ? `<button data-page="novaMateria">Nova Matéria</button>`
            : ""
        }

        ${
          pode(usuario, "editar") || pode(usuario, "excluir") || pode(usuario, "publicar")
            ? `<button data-page="listarMaterias">Matérias Publicadas</button>`
            : ""
        }

        <button data-page="editarPerfil">
          Editar Perfil
        </button>

        ${
          usuario.role === "superadmin"
            ? `
              <button data-page="cadastrarAdm">
                Cadastrar ADM
              </button>

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
