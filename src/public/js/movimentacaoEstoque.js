// Função para verificar se o usuário está autenticado
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

// Função para redirecionar se o usuário não estiver autenticado
function redirecionarSeNaoAutenticado() {
    Autenticado().then(authenticated => {
        if (!authenticated) {
            window.location.href = 'index.html'; 
        }
    });
}

// Verifica autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname !== '/index.html') {
        redirecionarSeNaoAutenticado();
    }
    loadSelectOptions('/api/estoque', 'sigla-select');
    loadSelectOptions('/api/laboratorios', 'laboratorio-select');
    loadsiglasEntrada();
});

// Função genérica para carregar opções em um select
function loadSelectOptions(url, selectId) {
}

fetch('/api/lab')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const select = document.getElementById('laboratorio-select');
        select.innerHTML = ''; // Limpa o select antes de adicionar novas opções

        data.forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.id_laboratorio; // Use o ID do laboratório
            option.textContent = lab.nome_laboratorio; // Use o nome do laboratório
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar laboratórios:', error);
    });

fetch('/api/est')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const select = document.getElementById('sigla-select');
        select.innerHTML = ''; // Limpa o select antes de adicionar novas opções

        data.forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.id_estoque; // Use o ID do estoque
            option.textContent = lab.sigla; // Use a sigla como texto da opção
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar estoque:', error);
    });

// Função para carregar siglas de entrada
function loadsiglasEntrada() {
    // Implemente a lógica para carregar siglas de entrada aqui, se necessário
}

// Função para abrir a aba correspondente
function opentab(tabname) {
    document.querySelectorAll('.tab-links').forEach(link => link.classList.remove('active-link'));
    document.querySelectorAll('.tab-contents').forEach(content => content.classList.remove('active-tab'));

    document.getElementById(tabname).classList.add('active-tab');
    event.currentTarget.classList.add('active-link');
}

// Manipulador de eventos para os submenus
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

// Carregar siglas no select de entrada de produto
function loadsiglasEntrada() {
    fetch('/api/siglas')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('produto-entrada-select');
            select.innerHTML = ''; // Limpa o select antes de adicionar novas opções

            data.forEach(sigla => {
                const option = document.createElement('option');
                option.value = sigla.id_estoque; // Usar id_estoque como valor
                option.textContent = sigla.sigla; // Exibir a sigla como texto da opção
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar siglas:', error));
}

// Chama a função quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    loadsiglasEntrada();
});

// Manipulador de envio do formulário de entrada
document.getElementById('entrada-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário

    const idEstoque = document.getElementById('produto-entrada-select').value;
    const quantidade = parseInt(document.getElementById('quantidade-entrada').value);
    const dataEntrada = document.getElementById('data-entrada').value;
    const descricao = document.getElementById('descricao-entrada').value;

    // Validação dos campos
    if (!idEstoque || !quantidade || !dataEntrada || !descricao) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    const entradaData = {
        id_estoque: idEstoque,
        quantidade: quantidade,
        data_entrada: dataEntrada,
        descricao: descricao
    };

    // Envia os dados para registrar a entrada e atualizar o estoque
    fetch('/api/registrar_entrada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entradaData),
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert(result.message);
        } else {
            alert(result.error);
        }
    })
    .catch(error => console.error('Erro ao registrar entrada:', error));
});

document.getElementById('consumo-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário

    const sigla = document.getElementById('sigla-select').value;
    const quantidade = document.getElementById('quantidade').value;
    const laboratorio = document.getElementById('laboratorio-select').value;
    const data_consumo = document.getElementById('data_consumo').value;
    const descricao = document.getElementById('descricao_comsumo').value;

    // Verifica se todos os campos estão preenchidos
    if (!sigla || !quantidade || !laboratorio || !data_consumo || !descricao) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Cria o objeto de dados para enviar
    const consumoData = {
        data_consumo: data_consumo,
        id_estoque: sigla,
        id_laboratorio: laboratorio,
        quantidade: quantidade,
        descricao: descricao
    };

    // Enviar os dados corretamente
    fetch('/api/registrar_consumo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(consumoData) 
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert(result.message);
        } else {
            alert(result.error);
        }
    })
    .catch(error => console.error('Erro ao registrar consumo:', error));
});
