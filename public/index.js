import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore.ts';

import { router } from './modules/router.ts';

router.startRouting();
