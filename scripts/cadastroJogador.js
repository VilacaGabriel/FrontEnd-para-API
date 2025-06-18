// Pega o ID da URL (modo edição)
const params = new URLSearchParams(window.location.search);
const playerId = params.get("id");

// Se estiver em modo edição, busca os dados e preenche o formulário
if (playerId) {
    preencherFormularioParaEdicao(playerId);
}

async function preencherFormularioParaEdicao(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://192.168.1.124:3000/player/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar jogador.");

        const jogador = await response.json();

        document.getElementById("nome").value = jogador.namePlayer;
        document.getElementById("sobrenome").value = jogador.lastNamePlayer;
        document.getElementById("genero").value = jogador.gender;
        document.getElementById("numero_contato").value = jogador.numberPhone || "";
        document.getElementById("categoria_sup").value = jogador.superCategory;
        document.getElementById("categoria_fed").value = jogador.federationCategory;
        document.getElementById("clube").value = jogador.club;
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados do jogador para edição.");
    }
}

document.getElementById("cadastro-jogador-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const genero = document.getElementById("genero").value;
    const numero = document.getElementById("numero_contato").value.trim();
    const categoriaSup = document.getElementById("categoria_sup").value;
    const categoriaFed = document.getElementById("categoria_fed").value;
    const clube = document.getElementById("clube").value.trim();
    const mensagemErro = document.getElementById("mensagem-erro");

    mensagemErro.textContent = "";

    if (!nome || !sobrenome || !genero || !categoriaSup || !categoriaFed || !clube || !numero) {
        mensagemErro.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        mensagemErro.textContent = "Você precisa estar logado para cadastrar ou editar um jogador.";
        return;
    }

    const metodo = playerId ? "PUT" : "POST";
    const url = playerId 
        ? `http://192.168.1.124:3000/player/${playerId}` 
        : "http://192.168.1.124:3000/player";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                namePlayer: nome,
                lastNamePlayer: sobrenome,
                gender: genero,
                numberPhone: numero,
                superCategory: categoriaSup,
                federationCategory: categoriaFed,
                club: clube
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(playerId ? "Jogador atualizado com sucesso!" : "Jogador cadastrado com sucesso!");
            window.location.href = "players.html"; // redireciona após ação
        } else {
            mensagemErro.textContent = data.error || "Erro ao salvar jogador.";
        }
    } catch (error) {
        mensagemErro.textContent = "Erro na conexão com o servidor.";
    }
});
