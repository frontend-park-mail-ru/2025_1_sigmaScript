// import Navbar from '../components/navbar/navbar.js';
import MainPage from './main_page/main_page.js';
// import { Login } from '/Login/Login.js';
import { createID } from '../utils/createID.js';

const rootElement = document.getElementById('root');

/**
 * Отрисовывает главную страницу
 */
// function renderMain() {
//   rootElement.innerHTML = '';
//   const mainEl = document.createElement('main');

//   const login = document.createElement('a');
//   login.innerHTML = 'Войти';
//   login.addEventListener('click', (e) => {
//     e.preventDefault();
//     renderLogin();
//   });
//   rootElement.appendChild(mainEl);
//   mainEl.appendChild(login);
// }

// /**
//  * Отрисовывает страницу входа (авторизации)
//  */
// function renderLogin() {
//   rootElement.innerHTML = '';
//   const login = new Login(rootElement, renderMain);
//   login.render();
// }

const main = new MainPage(rootElement, { id: `${createID()}` });
main.render();

// renderLogin();
