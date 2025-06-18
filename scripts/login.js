document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  try {
    const response = await fetch("http://192.168.1.124:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Salva token
      localStorage.setItem("token", data.token);

      // Salva dados do usuário
      localStorage.setItem("usuarioLogado", JSON.stringify({
        email: data.email,
        nome: data.nameUser
      }));

      // Redireciona
      window.location.href = "ranking.html";
    } else {
      document.getElementById("mensagem-erro").textContent = data.erro || "Erro ao fazer login";
    }
  } catch (err) {
    document.getElementById("mensagem-erro").textContent = "Erro na conexão com o servidor.";
  }
});
