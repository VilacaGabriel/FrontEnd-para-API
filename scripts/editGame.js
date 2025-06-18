async function carregarFormEdicao() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  const token = localStorage.getItem('token');
  const msgErro = document.getElementById('mensagem-erro');

  if (!token) {
    alert('Você precisa estar logado.');
    return window.location.href = 'login.html';
  }
  if (!gameId) {
    return msgErro.textContent = 'ID do jogo não fornecido.';
  }

  try {
    // 1) Buscar dados do jogo
    const resJogo = await fetch(`http://localhost:3000/games/${gameId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resJogo.ok) throw new Error('Erro ao carregar dados do jogo');
    const jogo = await resJogo.json();

    // Preenche campos básicos
    document.getElementById('nameGame').value = jogo.nameGame;
    document.getElementById('gameCategory').value = jogo.gameCategory;
    document.getElementById('statusGame').value = jogo.statusGame;

    // 2) Buscar todos os jogadores
    const resPlayers = await fetch('http://localhost:3000/player', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resPlayers.ok) throw new Error('Erro ao carregar jogadores');
    const allPlayers = await resPlayers.json();

    // 3) Buscar jogadores já associados ao jogo
    const resAssoc = await fetch(`http://localhost:3000/games/${gameId}/players`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resAssoc.ok) throw new Error('Erro ao carregar jogadores associados');
    const associated = await resAssoc.json();
    const associatedIds = new Set(associated.map(p => p.id));

    // 4) Montar checkboxes (marcando os já associados)
    const lista = document.getElementById('lista-jogadores');
    lista.innerHTML = '';
    allPlayers.forEach(p => {
      const div = document.createElement('div');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = `player_${p.id}`;
      cb.value = p.id;
      if (associatedIds.has(p.id)) cb.checked = true;

      const label = document.createElement('label');
      label.htmlFor = cb.id;
      label.textContent = `${p.namePlayer} ${p.lastNamePlayer}`;

      div.appendChild(cb);
      div.appendChild(label);
      lista.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    document.getElementById('mensagem-erro').textContent = err.message;
  }
}

document.getElementById('edit-game-form').addEventListener('submit', async e => {
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  const token = localStorage.getItem('token');
  const msgErro = document.getElementById('mensagem-erro');
  msgErro.textContent = '';

  // Coleta valores do formulário
  const nameGame = document.getElementById('nameGame').value.trim();
  const gameCategory = document.getElementById('gameCategory').value;
  const statusGame = document.getElementById('statusGame').value;

  // Coleta jogadores marcados
  const selected = [...document.querySelectorAll('#lista-jogadores input[type=checkbox]:checked')]
    .map(cb => cb.value);

  if (!nameGame || !gameCategory) {
    return msgErro.textContent = 'Nome e categoria são obrigatórios.';
  }

  try {
    // Envia PUT para atualizar jogo e associações
    const response = await fetch(`http://localhost:3000/games/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nameGame, gameCategory, statusGame, players: selected })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Erro ao salvar alterações');
    }

    alert('Jogo atualizado com sucesso!');
    window.location.href = 'games.html';
  } catch (err) {
    console.error(err);
    msgErro.textContent = err.message;
  }
});

window.onload = carregarFormEdicao;
