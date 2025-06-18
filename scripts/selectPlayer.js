async function carregarJogadores() {
  const token = localStorage.getItem('token');
  const listaJogadores = document.getElementById('lista-jogadores');
  listaJogadores.innerHTML = '';

  const gameId = new URLSearchParams(window.location.search).get('gameId');
  if (!gameId) {
    document.getElementById('mensagem-erro').textContent = 'ID do jogo não encontrado na URL.';
    return;
  }

  try {
    // Pega dados do jogo para a categoria
    const resGame = await fetch(`http://localhost:3000/games/${gameId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resGame.ok) throw new Error('Erro ao carregar dados do jogo');
    const jogo = await resGame.json();

    // Pega todos os jogadores
    const resPlayers = await fetch('http://localhost:3000/player', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resPlayers.ok) throw new Error('Erro ao carregar jogadores');
    const jogadores = await resPlayers.json();

    // Filtra jogadores pela categoria do jogo
    const jogadoresFiltrados = jogadores.filter(jogador => jogador.superCategory === jogo.gameCategory);

    if (jogadoresFiltrados.length === 0) {
      listaJogadores.textContent = 'Nenhum jogador disponível para a categoria deste jogo.';
      return;
    }

    // Cria checkboxes para os jogadores filtrados
    jogadoresFiltrados.forEach(jogador => {
      const div = document.createElement('div');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `player_${jogador.id}`;
      checkbox.value = jogador.id;

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = `${jogador.namePlayer} ${jogador.lastNamePlayer}`;

      div.appendChild(checkbox);
      div.appendChild(label);

      listaJogadores.appendChild(div);
    });

  } catch (error) {
    document.getElementById('mensagem-erro').textContent = error.message;
  }
}

document.getElementById('form-selecionar-jogadores').addEventListener('submit', async function (e) {
  e.preventDefault();

  const selectedPlayers = [...document.querySelectorAll('#lista-jogadores input[type=checkbox]:checked')]
    .map(input => input.value);

  if (selectedPlayers.length === 0) {
    document.getElementById('mensagem-erro').textContent = 'Selecione pelo menos um jogador.';
    return;
  }

  const gameId = new URLSearchParams(window.location.search).get('gameId');
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://localhost:3000/game/${gameId}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ players: selectedPlayers })
    });

    if (response.ok) {
      alert('Jogadores associados ao jogo com sucesso!');
      window.location.href = 'games.html';  // Redireciona para a lista de jogos
    } else {
      const data = await response.json();
      document.getElementById('mensagem-erro').textContent = data.error || 'Erro ao associar jogadores.';
    }
  } catch (error) {
    document.getElementById('mensagem-erro').textContent = 'Erro na conexão com o servidor.';
  }
});

window.onload = carregarJogadores;
