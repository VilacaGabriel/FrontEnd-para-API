// auth.js
function verificarAutenticacao() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html"; // redireciona para login
  }
}
