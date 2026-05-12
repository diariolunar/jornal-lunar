import { pegarSessao }
from "./session.js";

export function usuarioAtual() {

  return pegarSessao();
}

export function isSuperAdmin() {

  const user = pegarSessao();

  return user?.superadmin === true;
}

export function podePostar() {

  const user = pegarSessao();

  return user?.permissoes?.postar === true;
}

export function podeEditar() {

  const user = pegarSessao();

  return user?.permissoes?.editar === true;
}

export function podeExcluir() {

  const user = pegarSessao();

  return user?.permissoes?.excluir === true;
}
