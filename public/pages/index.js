import { Login } from '/Login/Login.js';

const rootElement = document.getElementById('root');

function renderMain() {
    const login = document.createElement('a');
    login.innerHTML = 'Войти';
    login.addEventListener('click', (e) => {
        e.preventDefault();
        renderLogin();
    });
    rootElement.appendChild(login);
}

function renderLogin() {
    rootElement.innerHTML = '';
    const login = new Login(rootElement);
    login.render();
}

renderMain();
