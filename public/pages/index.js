import { Login } from '/Login/Login.js';

const rootElement = document.getElementById('root');

/**
 * Отрисовывает главную страницу
 */
function renderMain() {
    rootElement.innerHTML = '';
    const login = document.createElement('a');
    login.innerHTML = 'Войти';
    login.addEventListener('click', (e) => {
        e.preventDefault();
        renderLogin();
    });
    rootElement.appendChild(login);
}

/**
 * Отрисовывает страницу входа (авторизации)
 */
function renderLogin() {
    rootElement.innerHTML = '';
    const login = new Login(rootElement, renderMain);
    login.render();
}

renderLogin();
