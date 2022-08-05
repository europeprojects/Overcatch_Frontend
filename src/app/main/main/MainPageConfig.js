import { authRoles } from 'app/auth';
import i18next from 'i18next';
import Example from './MainPage';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import MainPage from "./MainPage";

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const MainPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},

	auth: authRoles.customer,
	routes: [
		{
			path: '/main',
			component: MainPage
		}
	]
};

export default MainPageConfig;
