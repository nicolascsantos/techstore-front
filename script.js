async function carregarProdutos() {
    const resposta = await fetch('https://techstoreinfnet-b5hhfugfhbdddqed.westus3-01.azurewebsites.net/api/produto', { method: 'GET' });
    if (!resposta.ok) throw new Error('Não foi possível carregar os produtos.');
    const produtos = await resposta.json();
    console.log(produtos);

    const tabela = document.getElementById('tabela-produtos');
    tabela.innerHTML = "";

    produtos.data.forEach(produto => {

        const linha = document.createElement('tr');

        [produto.id, produto.nomeProduto,
            `R$ ${Number(produto.valorUnitario).toFixed(2)}`,
            produto.quantidadeEmEstoque].forEach(valor => {
                const coluna = document.createElement('td');
                coluna.textContent = valor;
                linha.appendChild(coluna);
            });

        const acoes = document.createElement('td');
        acoes.innerHTML = '<button type="button">Atualizar</button> <button type="button">Excluir</button>';
        acoes.children[0].onclick = () => editarProduto(produto);
        acoes.children[1].onclick = () => removerProduto(produto.id);
        linha.appendChild(acoes);

        tabela.appendChild(linha);
    });
}

async function adicionarProduto() {
    const nomeProdutoTela = document.getElementById('nmProduto').value;
    const descricaoTela = "Produto TechStore";
    const valorUnitarioTela = document.getElementById('valorUnitarioProduto').value;
    const quantidadeEmEstoqueTela = document.getElementById('quantidadeEmEstoqueProduto').value;

    console.log(nomeProdutoTela)
    console.log(descricaoTela)
    console.log(valorUnitarioTela)
    console.log(quantidadeEmEstoqueTela)

    const input = {
        nomeProduto: nomeProdutoTela,
        descricao: descricaoTela,
        valorUnitario: valorUnitarioTela,
        quantidadeEmEstoque: quantidadeEmEstoqueTela
    }

    const resposta = await fetch('https://techstoreinfnet-b5hhfugfhbdddqed.westus3-01.azurewebsites.net/api/produto', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } });

    console.log(resposta);

    if (!resposta.ok) {
        console.log(resposta);
    }

    const resultado = await resposta.json();

    window.location.reload();

}

let produtoEmEdicao = null;

function editarProduto(produto) {
    produtoEmEdicao = produto;
    document.getElementById('nmProduto').value = produto.nomeProduto;
    document.getElementById('valorUnitarioProduto').value = produto.valorUnitario;
    document.getElementById('quantidadeEmEstoqueProduto').value = produto.quantidadeEmEstoque;
    document.getElementById('adicionar-produto').hidden = true;
    document.getElementById('salvar-produto').hidden = false;
    document.getElementById('cancelar-edicao').hidden = false;
    document.getElementById('nmProduto').focus();
}

async function removerProduto(id) {
    if (!window.confirm('Deseja excluir este produto?')) return;

    try {
        const resposta = await fetch(`https://techstoreinfnet-b5hhfugfhbdddqed.westus3-01.azurewebsites.net/api/produto/${id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Não foi possível excluir o produto.');

        window.location.reload();
    } catch (erro) {
        window.alert(erro.message);
    }
}

async function atualizarProduto() {
    if (!produtoEmEdicao) return;

    const nomeProduto = document.getElementById('nmProduto').value.trim();
    const valorTela = document.getElementById('valorUnitarioProduto').value;
    const quantidadeTela = document.getElementById('quantidadeEmEstoqueProduto').value.trim();
    const valorUnitario = Number(valorTela);
    const quantidadeEmEstoque = Number(quantidadeTela);

    if (!nomeProduto || !valorTela || !quantidadeTela ||
        !Number.isFinite(valorUnitario) || valorUnitario < 0 ||
        !Number.isInteger(quantidadeEmEstoque) || quantidadeEmEstoque < 0 ||
        quantidadeEmEstoque > 2147483647) {
        window.alert('Informe o nome, um valor válido e uma quantidade inteira não negativa.');
        return;
    }

    const input = {
        id: produtoEmEdicao.id,
        nomeProduto,
        descricao: produtoEmEdicao.descricao,
        valorUnitario,
        quantidadeEmEstoque
    };

    try {
        const resposta = await fetch(`https://techstoreinfnet-b5hhfugfhbdddqed.westus3-01.azurewebsites.net/api/produto/${input.id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!resposta.ok) throw new Error('Não foi possível atualizar o produto.');

        window.location.reload();
    } catch (erro) {
        window.alert(erro.message);
    }
}

carregarProdutos().catch(erro => window.alert(erro.message));
