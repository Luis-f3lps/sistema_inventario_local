function Autenticado() {
    return fetch('/api/check-auth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => data.Autenticado)
    .catch(() => false);
}

function redirecionarSeNaoAutenticado() {
    Autenticado().then(authenticated => {
        if (!authenticated) {
            window.location.href = 'index.html'; // Redireciona para a página de login
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname !== '/index.html') {
        redirecionarSeNaoAutenticado();
    }
});

// Função para abrir abas
function opentab(tabname) {
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");

    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active-link");
    }
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].classList.remove("active-tab");
        if (tabcontents[i].id === tabname) {
            tabcontents[i].classList.add("active-tab");
        }
    }
    document.querySelector(`.tab-links[onclick="opentab('${tabname}')"]`).classList.add("active-link");
}

// Função para carregar dados de produtos e preencher a tabela
function loadProdutos() {
    fetch('/api/estoque')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('produto-tbody');
            tbody.innerHTML = ''; // Limpa a tabela antes
            
            data.forEach(entry => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${entry.sigla || 'N/A'}</td>
                    <td>${entry.nome_produto || 'N/A'}</td>
                    <td>${entry.concentracao || 'N/A'}</td>
                    <td>${entry.densidade || 'N/A'}</td>
                    <td class="numeric">${entry.quantidade || 'N/A'}</td>
                    <td>${entry.tipo_unidade_produto || 'N/A'}</td>
                    <td>${entry.ncm || 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Função para carregar produtos no select
function loadProdutosSelect() {
    fetch('/api/produto')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('id_produto');
            select.innerHTML = ''; // Limpa o select antes de adicionar novas

            data.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id_produto;
                option.textContent = produto.nome_produto;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadProdutos();       
    loadProdutosSelect(); 
    loadEstoque(); 
});

// menu
document.querySelectorAll('.submenu > a').forEach(menu => {
    menu.addEventListener('click', function(e) {
        e.preventDefault();
        const submenuItems = this.nextElementSibling;
        submenuItems.classList.toggle('open');
        this.querySelector('.fas.fa-chevron-down').classList.toggle('rotate');
    });
});

// Pegar o nome do usuário logado
function loadLoggedInUser() {
    fetch('/api/usuario-logado')
    .then(response => response.json())
    .then(data => {
        const userNameElement = document.getElementById('user-name-text');
        userNameElement.innerHTML = data.nome;
        if (data.tipo_usuario === 'admin') {
            document.querySelector('.admin-menu').style.display = 'block';
        }
    })
    .catch(error => console.error('Erro ao carregar usuário logado:', error));
}
loadLoggedInUser();

function loadEstoque(page = 1, limit = 20) {
    fetch(`/api/estoquePag?page=${page}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('produto-tbody');
            tbody.innerHTML = ''; // Limpar a tabela
            data.data.forEach(estoque => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${estoque.sigla}</td>
                    <td>${estoque.nome_produto}</td>
                    <td>${estoque.concentracao}</td>
                    <td>${estoque.densidade}</td>
                    <td>${estoque.quantidade}</td>
                    <td>${estoque.tipo_unidade_produto}</td>
                    <td>${estoque.ncm}</td>
                `;
                tbody.appendChild(tr);
            });

            updatePagination(data.totalPages, data.currentPage);
        })
        .catch(error => console.error('Erro ao carregar estoques:', error));
}

function updatePagination(totalPages, currentPage) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Limpar a paginação

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => loadEstoque(i));
        paginationDiv.appendChild(button);
    }
}

function geradorPdfEstoque() {
    fetch('/generate-pdf-estoque', {
                method: 'GET',
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Falha ao gerar o PDF.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Relatorio_Estoque.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao gerar o PDF.');
            });
}