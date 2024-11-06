document.addEventListener("DOMContentLoaded", () => {
    const productModal = document.getElementById("productModal");
    const openModalButton = document.getElementById("openModalButton");
    const closeModalButton = document.getElementById("closeModalButton");
    const cancelModalButton = document.getElementById("cancelModalButton");
    const submitProductButton = document.getElementById("submitProductButton");
    const searchInput = document.getElementById("searchInput");
    const productList = document.getElementById("productList").getElementsByTagName("tbody")[0];
    const productForm = document.getElementById("productForm");

    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Função para atualizar a tabela de produtos
    function updateProductTable() {
        productList.innerHTML = "";
        products.forEach(product => {
            const row = productList.insertRow();
            row.innerHTML = `
                <td>${product.codigo}</td>
                <td>${product.descricao}</td>
                <td>${product.dataFabricacao}</td>
                <td>${product.unidade}</td>
                <td>${product.quantidadeLances}</td>
                <td>${product.acondicionamento}</td>
                <td>${product.total}</td>
                <td>${product.lote}</td>
                <td>${product.observacoes}</td>
                <td>
                    <button class="edit-btn" aria-label="Editar Produto" data-codigo="${product.codigo}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" aria-label="Excluir Produto" data-codigo="${product.codigo}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
        });
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Abrir o modal
    openModalButton.addEventListener("click", () => {
        productModal.style.display = "block";
        document.getElementById("modalTitle").textContent = "Adicionar Produto";
        submitProductButton.textContent = "Adicionar Produto";
        resetForm();
    });

    // Fechar o modal
    closeModalButton.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    cancelModalButton.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    // Adicionar ou editar um produto
    submitProductButton.addEventListener("click", () => {
        const codigo = document.getElementById("codigo").value;
        const descricao = document.getElementById("descricao").value;
        const dataFabricacao = document.getElementById("dataFabricacao").value;
        const unidade = document.getElementById("unidade").value;
        const quantidadeLances = parseFloat(document.getElementById("quantidadeLances").value);
        const acondicionamento = parseFloat(document.getElementById("acondicionamento").value);
        const lote = document.getElementById("lote").value;
        const observacoes = document.getElementById("observacoes").value;

        if (isNaN(quantidadeLances) || isNaN(acondicionamento)) {
            alert("A quantidade de lances e acondicionamento devem ser números válidos.");
            return;
        }

        const total = quantidadeLances * acondicionamento;

        // Verificar se estamos editando um produto
        const productIndex = products.findIndex(p => p.codigo === codigo);

        if (productIndex === -1) {
            // Adicionar novo produto
            const newProduct = { codigo, descricao, dataFabricacao, unidade, quantidadeLances, acondicionamento, total, lote, observacoes };
            products.push(newProduct);
        } else {
            // Editar produto existente
            products[productIndex] = { codigo, descricao, dataFabricacao, unidade, quantidadeLances, acondicionamento, total, lote, observacoes };
        }

        productModal.style.display = "none";
        updateProductTable();
    });

    // Excluir produto
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const codigo = e.target.getAttribute("data-codigo");
            products = products.filter(p => p.codigo !== codigo);
            updateProductTable();
        }
    });

    // Função para buscar produtos na tabela
    searchInput.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        const rows = productList.rows;
        for (const row of rows) {
            const product = row.cells;
            const match = Array.from(product).some(cell =>
                cell.textContent.toLowerCase().includes(searchValue)
            );
            row.style.display = match ? "" : "none";
        }
    });

    // Função para resetar o formulário
    function resetForm() {
        productForm.reset();
        document.getElementById("total").value = "";
    }

    // Inicializar a tabela com produtos armazenados
    updateProductTable();
});
