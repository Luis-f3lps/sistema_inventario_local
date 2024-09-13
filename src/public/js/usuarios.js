// Autenticado
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
            window.location.href = 'index.html'; 
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname !== '/index.html') {
        redirecionarSeNaoAutenticado();
    }
});

// opentab
function opentab(tabname) {
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");

    Array.from(tablinks).forEach(link => link.classList.remove("active-link"));
    
    Array.from(tabcontents).forEach(content => {
        content.classList.remove("active-tab");
        if (content.id === tabname) {
            content.classList.add("active-tab");
        }
    });

    event.currentTarget.classList.add("active-link");
}

// loadUsers
function loadUsers() {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('usuarios-tbody');
            const select = document.getElementById('usuarios-select');
            
            data.forEach(usuario => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.nome_usuario}</td>
                    <td>${usuario.email}</td>
                `;
                tbody.appendChild(tr);

                const option = document.createElement('option');
                option.value = usuario.email;
                option.textContent = usuario.nome_usuario;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar usuários:', error));
}


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


// Adicionar novo usuário
document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const userType = document.getElementById('type').value; // Novo campo para o tipo de usuário
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_usuario: username, email: email, tipo_usuario: userType, senha: password }) // Inclua o tipo de usuário aqui
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);

            // Adicionar o novo usuário na tabela
            const tbody = document.getElementById('usuarios-tbody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${username}</td>
                <td>${email}</td>
            `;
            tbody.appendChild(tr);

            // Adicionar o novo usuário no select para remoção
            const select = document.getElementById('usuarios-select');
            const option = document.createElement('option');
            option.value = email;
            option.textContent = username;
            select.appendChild(option);

            // Limpar o formulário
            document.getElementById('add-user-form').reset();
        }
    })
    .catch(error => console.error('Erro ao adicionar usuário:', error));
});

// Remover usuário
document.getElementById('remove-user-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('usuarios-select').value;

    fetch(`/api/usuarios/${email}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);

            // Remover o usuário da tabela
            const rows = document.querySelectorAll(`#usuarios-tbody tr`);
            rows.forEach(row => {
                if (row.cells[1].textContent === email) {
                    row.remove();
                }
            });

            // Remover o usuário do select
            const options = document.querySelectorAll(`#usuarios-select option`);
            options.forEach(option => {
                if (option.value === email) {
                    option.remove();
                }
            });

            // Limpar o formulário
            document.getElementById('remove-user-form').reset();
        }
    })
    .catch(error => console.error('Erro ao remover usuário:', error));
});

// Inicializar as funções
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadLoggedInUser();
});

// Coisa legal do submenu
document.querySelectorAll('.submenu > a').forEach(menu => {
    menu.addEventListener('click', function(e) {
        e.preventDefault();
        const submenuItems = this.nextElementSibling;
        submenuItems.classList.toggle('open');
        this.querySelector('.fas.fa-chevron-down').classList.toggle('rotate');
    });
});
