import MainPage from './main_page/main_page.js';
import { createID } from '../utils/createID.js';

const rootElement = document.getElementById('root');

const main = new MainPage(rootElement, { id: `${createID()}` });
main.render();
