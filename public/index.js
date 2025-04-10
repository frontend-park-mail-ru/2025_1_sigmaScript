import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore';
import 'store/InitialStore';
import 'store/UserPageStore';
import 'store/NavbarStore';

import { router } from './modules/router.ts';
import { initialStore } from 'store/InitialStore.ts';

router.startRouting();
initialStore.start();
