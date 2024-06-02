const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');

// Evento para alternar a tela de registro
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Evento para alternar a tela de login
document.querySelector('.register').addEventListener('click', () => {
    container.classList.add("active");
});



