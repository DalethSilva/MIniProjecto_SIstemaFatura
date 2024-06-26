const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Evento para alternar a tela de registro
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Evento para alternar a tela de login
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
