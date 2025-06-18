function preencherRanking(lista) {
  const tbody = document.getElementById("ranking-body");
  tbody.innerHTML = "";

  lista.forEach(jogador => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = `${jogador.namePlayer} ${jogador.lastNamePlayer}`;
    tr.appendChild(tdNome);

    const tdSexo = document.createElement("td");
    tdSexo.textContent = jogador.gender;
    tr.appendChild(tdSexo);

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = jogador.superCategory;
    tr.appendChild(tdCategoria);

    const tdScore = document.createElement("td");
    tdScore.textContent = jogador.scoreTotal ?? 0;
    tr.appendChild(tdScore);

    tbody.appendChild(tr);
  });
}

async function carregarJogadores() {
  try {
    const response = await fetch('http://192.168.1.124:3000/player');
    if (!response.ok) {
      throw new Error('Erro ao acessar a API: ' + response.status);
    }

    let data = await response.json();

    // Ordenar do maior para o menor score
    data.sort((a, b) => {
      const scoreA = a.scoreTotal ?? 0;
      const scoreB = b.scoreTotal ?? 0;
      return scoreB - scoreA;
    });

    preencherRanking(data);
  } catch (error) {
    console.error('Erro ao carregar jogadores:', error.message);
  }
}

window.onload = () => {
  carregarJogadores();
};
