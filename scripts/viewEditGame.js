async function carregarJogo() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  const token = localStorage.getItem('token');
  const msgErro = document.getElementById('mensagem-erro');

  if (!token) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
    return;
  }

  if (!gameId) {
    msgErro.textContent = 'ID do jogo não fornecido.';
    return;
  }

  try {
    const resJogo = await fetch(`http://localhost:3000/games/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resJogo.ok) throw new Error('Erro ao carregar dados do jogo');
    const jogo = await resJogo.json();

    document.getElementById('nome-jogo').textContent = jogo.nameGame || '—';
    document.getElementById('categoria-jogo').textContent = jogo.gameCategory || '—';
    document.getElementById('status-jogo').textContent = jogo.statusGame ? 'Ativo' : 'Inativo';

    await carregarJogadores(gameId, token);
    await carregarPontuacaoJogadores(gameId, token);
  } catch (error) {
    console.error(error);
    msgErro.textContent = error.message;
  }
}

async function carregarJogadores(gameId, token) {
  const res = await fetch(`http://localhost:3000/games/${gameId}/players`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Erro ao carregar jogadores');

  const jogadores = await res.json();
  const tbody = document.getElementById('lista-jogadores');
  tbody.innerHTML = '';

  if (jogadores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Nenhum jogador associado a este jogo.</td></tr>';
    return;
  }

  jogadores.forEach(jogador => {
    const p = jogador.PlayerGame || {};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${jogador.namePlayer} ${jogador.lastNamePlayer}</td>
      <td>${jogador.superCategory || '-'}</td>
      <td>${p.vitorias ?? 0}</td>
      <td>${p.derrotas ?? 0}</td>
      <td>${p.saldoGames ?? 0}</td>
      <td>${p.gamesPro ?? 0}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function carregarPontuacaoJogadores(gameId, token) {
  const res = await fetch(`http://localhost:3000/games/${gameId}/players`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Erro ao carregar pontuações');

  const jogadores = await res.json();
  const tbody = document.getElementById('form-jogadores');
  tbody.innerHTML = '';

  jogadores.forEach(jogador => {
    const p = jogador.PlayerGame || {};
    const tr = document.createElement('tr');
    tr.dataset.playerId = jogador.id;
    tr.innerHTML = `
      <td>${jogador.namePlayer} ${jogador.lastNamePlayer}</td>
      <td><input type="number" name="vitorias_${jogador.id}" value="${p.vitorias ?? 0}" /></td>
      <td><input type="number" name="derrotas_${jogador.id}" value="${p.derrotas ?? 0}" /></td>
      <td><input type="number" name="saldo_${jogador.id}" value="${p.saldoGames ?? 0}" /></td>
      <td><input type="number" name="gamespro_${jogador.id}" value="${p.gamesPro ?? 0}" /></td>
    `;
    tbody.appendChild(tr);
  });
}

// Salvar pontuações
document.getElementById('form-pontuacao').addEventListener('submit', async e => {
  e.preventDefault();

  const gameId = new URLSearchParams(window.location.search).get('id');
  const token = localStorage.getItem('token');
  const msgErro = document.getElementById('mensagem-erro');

  const linhas = document.querySelectorAll('#form-jogadores tr');
  const stats = {};

  linhas.forEach(tr => {
    const playerId = tr.dataset.playerId;
    if (!playerId) return;

    stats[playerId] = {
      vitorias: parseInt(tr.querySelector(`[name="vitorias_${playerId}"]`).value),
      derrotas: parseInt(tr.querySelector(`[name="derrotas_${playerId}"]`).value),
      saldo: parseInt(tr.querySelector(`[name="saldo_${playerId}"]`).value),
      gamespro: parseInt(tr.querySelector(`[name="gamespro_${playerId}"]`).value)
    };
  });

  try {
    const res = await fetch(`http://localhost:3000/games/${gameId}/players/stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(stats)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao atualizar pontuação.');
    }

    alert('Pontuações atualizadas com sucesso!');
    await carregarJogadores(gameId, token);
  } catch (error) {
    console.error(error);
    msgErro.textContent = error.message;
  }
});

window.onload = carregarJogo;
