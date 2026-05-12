import { db }
from "../../config/firebase.js";

import {
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
  salvarSessao
}
from "./session.js";

export async function fazerLogin(
  email,
  senha
) {

  const snapshot =
    await getDocs(collection(db, "admins"));

  let usuarioEncontrado = null;

  snapshot.forEach((item) => {

    const adm = item.data();

    if (
      adm.email === email
      &&
      adm.senha === senha
    ) {

      usuarioEncontrado = {
        id: item.id,
        ...adm
      };
    }
  });

  if (!usuarioEncontrado) {

    return {
      sucesso: false,
      mensagem: "E-mail ou senha inválidos."
    };
  }

  salvarSessao(usuarioEncontrado);

  return {
    sucesso: true,
    usuario: usuarioEncontrado
  };
}
