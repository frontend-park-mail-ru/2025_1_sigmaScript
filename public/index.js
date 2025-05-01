import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore';
import 'store/PersonPageStore';
import 'store/MoviePageStore';
import 'store/UserPageStore';
import 'store/NavbarStore';
import 'store/CsatStore';
import 'store/StatsPageStore';
import 'store/PopupStore';
import 'components/Popup/popup';

import { router } from 'public/modules/router';

import { initialStore } from 'store/InitialStore';

router.startRouting();
initialStore.start();
