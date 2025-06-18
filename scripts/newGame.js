async function carregarJogadores() {
  const token = localStorage.getItem('token');
  const listaJogadores = document.getElementById('lista-jogadores');
  listaJogadores.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3000/player', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Erro ao carregar jogadores');

    const jogadores = await response.json();

    jogadores.forEach(jogador => {
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

document.getElementById('game-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nameGame = document.getElementById('nameGame').value.trim();
  const gameCategory = document.getElementById('gameCategory').value;
  const msgErro = document.getElementById('mensagem-erro');
  msgErro.textContent = '';

  if (!nameGame || !gameCategory) {
    msgErro.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  const selectedPlayers = [...document.querySelectorAll('#lista-jogadores input[type=checkbox]:checked')]
    .map(input => input.value);

  if (selectedPlayers.length === 0) {
    msgErro.textContent = 'Selecione pelo menos um jogador.';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    msgErro.textContent = 'Você precisa estar logado para criar um jogo.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nameGame,
        gameCategory,
        statusGame: "Em andamento",
        players: selectedPlayers
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Jogo criado com sucesso!');
      e.target.reset();
      window.location.href = 'games.html'; // Ou outra página que desejar
    } else {
      msgErro.textContent = data.erro || 'Erro ao criar jogo.';
    }
  } catch (error) {
    msgErro.textContent = 'Erro na conexão com o servidor.';
  }
});

window.onload = carregarJogadores;
