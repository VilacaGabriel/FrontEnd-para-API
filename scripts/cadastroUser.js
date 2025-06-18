document.getElementById("cadastro-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nameUser = document.getElementById("nome").value.trim();
  const lastNameUser = document.getElementById("sobrenome").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const msgErro = document.getElementById("mensagem-erro");

  msgErro.textContent = "";

  if (password !== confirmarSenha) {
    msgErro.textContent = "As senhas não conferem.";
    return;
  }

  try {
    const response = await fetch("http://192.168.1.124:3000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      nameUser,
      lastNameUser,
      email,
      password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      window.location.href = "login.html";
    } else {
      msgErro.textContent = data.erro || "Erro ao cadastrar usuário.";
    }
  } catch (err) {
    msgErro.textContent = "Erro na conexão com o servidor.";
  }
});
