import './index.css';

import 'store/LoginStore';
import 'store/MainPageStore.ts';
import 'store/InitialStore';
import 'store/PersonPageStore';

import { router } from 'public/modules/router';

import { initialStore } from 'store/InitialStore';
import { PersonPage } from 'pages/person_page/person_page';

const rootElement = document.getElementById('root');

if (rootElement) {
  const personPage = new PersonPage(rootElement, router.getCurrentPath());
  initialStore.store(personPage);

  personPage.render();
}

router.startRouting();
