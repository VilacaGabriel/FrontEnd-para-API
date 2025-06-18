window.addEventListener("DOMContentLoaded", () => {
  const botaoLogin = document.getElementById("botao-login");
  const token = localStorage.getItem("token");

  if (token) {
    // Usuário está logado — troca para "Logout"
    botaoLogin.textContent = "Logout";
    botaoLogin.href = "#"; // impede de ir para tela de login
    botaoLogin.addEventListener("click", (e) => {
      e.preventDefault();
      // Limpa o localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioLogado");
      // Redireciona para tela inicial
      window.location.href = "index.html";
    });
  }
});