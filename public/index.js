import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore.ts';

// import MainPage from 'pages/main_page/main_page.js';
// import { createID } from 'utils/createID.ts';
import { router } from './modules/router.ts';

// const rootElement = document.getElementById('root');

// const main = new MainPage(rootElement, { id: `${createID()}` });
// main.render();

router.startRouting();
