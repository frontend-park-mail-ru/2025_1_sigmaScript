import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore.ts';
import 'store/UserPageStore';

import { router } from './modules/router.ts';
import MainPage from 'pages/main_page/main_page.js';
import { createID } from 'utils/createID.ts';

router.startRouting();
