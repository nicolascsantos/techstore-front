async function carregarProdutos() {
    const resposta = await fetch('https://techstoreinfnet-b5hhfugfhbdddqed.westus3-01.azurewebsites.net/api/produto', { method: 'GET' });
    const produtos = await resposta.json();
    console.log(produtos);

    const tabela = document.getElementById('tabela-produtos');
    tabela.innerHTML = "";

    produtos.data.forEach(produto => {

        const linha = document.createElement('tr');

        linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nomeProduto}</td>
                <td>R$ ${Number(produto.valorUnitario).toFixed(2)}</td>
                <td>${produto.quantidadeEmEstoque}</td>
            `;

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

carregarProdutos();
