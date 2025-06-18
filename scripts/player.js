async function carregarJogadores() {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = ''; // limpa tabela

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para ver os jogadores');
        return;
    }

    try {
        const response = await fetch('http://192.168.1.124:3000/player', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar jogadores');
        }

        const jogadores = await response.json();

        jogadores.forEach(jogador => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${jogador.namePlayer}</td>
                <td>${jogador.lastNamePlayer}</td>
                <td>${jogador.gender}</td>
                <td>${jogador.numberPhone || ''}</td>
                <td>${jogador.superCategory}</td>
                <td>${jogador.federationCategory}</td>
                <td>${jogador.club || ''}</td>
                <td><a href="cadastroJogador.html?id=${jogador.id}">Editar</a></td>
                <td><a href="#" data-id="${jogador.id}" class="excluir-jogador">Excluir</a></td>
            `;

            tbody.appendChild(tr);
        });

        // Adiciona evento para exclusão
        document.querySelectorAll('.excluir-jogador').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este jogador?')) {
                    try {
                        const delResponse = await fetch(`http://192.168.1.124:3000/player/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (delResponse.status === 204) {
                            alert('Jogador excluído com sucesso!');
                            carregarJogadores(); // Recarrega a lista
                        } else {
                            const errorData = await delResponse.json();
                            alert('Erro ao excluir jogador: ' + (errorData.error || 'Erro desconhecido'));
                        }
                    } catch (err) {
                        alert('Erro na conexão ao excluir jogador');
                    }
                }
            });
        });

    } catch (error) {
        alert(error.message);
    }
}

// Executa ao carregar a página
window.addEventListener('load', carregarJogadores);
