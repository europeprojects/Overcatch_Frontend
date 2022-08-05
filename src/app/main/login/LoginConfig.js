import { authRoles } from 'app/auth';
import i18next from 'i18next';
import Login from './Login';
import en from './i18n/en';
import tr from './i18n/tr';

i18next.addResourceBundle('en', 'LoginPage', en);
i18next.addResourceBundle('tr', 'LoginPage', tr);
const LoginConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/login',
			component: Login
		}
	]
};

export default LoginConfig;
