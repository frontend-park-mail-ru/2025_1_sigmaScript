import './index.css';
import MainPage from 'pages/main_page/main_page.js';
import { createID } from 'utils/createID.ts';
import 'store/LoginStore';
import 'store/UserPageStore';

const rootElement = document.getElementById('root');

const main = new MainPage(rootElement, { id: `${createID()}` });
main.render();
