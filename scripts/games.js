document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("ranking-body");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  fetch("http://192.168.1.124:3000/games", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(jogos => {
      tbody.innerHTML = "";

      jogos.forEach(jogo => {
        const tr = document.createElement("tr");

        // Nome do jogo
        const tdNome = document.createElement("td");
        tdNome.textContent = jogo.nameGame || "Sem nome";
        tr.appendChild(tdNome);

        // Categoria do jogo
        const tdCategoria = document.createElement("td");
        tdCategoria.textContent = jogo.gameCategory || "-";
        tr.appendChild(tdCategoria);

        // Status do jogo
        const tdStatus = document.createElement("td");
        // Se statusGame for boolean, converta para texto legível:
        tdStatus.textContent = jogo.statusGame === true ? "Ativo" : (jogo.statusGame === false ? "Inativo" : "-");
        tr.appendChild(tdStatus);

        // Link para ver o jogo
        const tdVer = document.createElement("td");
        const btnVer = document.createElement("a");
        btnVer.href = `viewEditGame.html?id=${jogo.id}`;
        btnVer.textContent = "Ver";
        tdVer.appendChild(btnVer);
        tr.appendChild(tdVer);

        // Link para editar o jogo
        const tdEditar = document.createElement("td");
        const btnEditar = document.createElement("a");
        btnEditar.href = `editGame.html?id=${jogo.id}`;
        btnEditar.textContent = "Editar";
        tdEditar.appendChild(btnEditar);
        tr.appendChild(tdEditar);

        // Botão para excluir o jogo
        const tdExcluir = document.createElement("td");
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = () => deletarJogo(jogo.id);
        tdExcluir.appendChild(btnExcluir);
        tr.appendChild(tdExcluir);

        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar jogos:", err);
      tbody.innerHTML = "<tr><td colspan='6'>Erro ao carregar dados.</td></tr>";
    });
});

function deletarJogo(id) {
  if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

  const token = localStorage.getItem("token");

  fetch(`http://192.168.1.124:3000/games/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        alert("Jogo deletado com sucesso!");
        location.reload();
      } else {
        alert("Erro ao deletar jogo.");
      }
    })
    .catch(() => alert("Erro ao se conectar com o servidor."));
}
