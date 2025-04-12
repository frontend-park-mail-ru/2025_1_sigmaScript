import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore';
import 'store/PersonPageStore';
import 'store/UserPageStore';
import 'store/NavbarStore';

import { router } from 'public/modules/router';

import { initialStore } from 'store/InitialStore';

const rootElement = document.getElementById('root');

router.startRouting();
initialStore.start();
