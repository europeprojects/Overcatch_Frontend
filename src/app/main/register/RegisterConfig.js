import { authRoles } from 'app/auth';
import Register from './Register';
import i18next from "i18next";
import en from "./register-i18n/en";
import tr from "./register-i18n/tr";

i18next.addResourceBundle('en', 'register', en);
i18next.addResourceBundle('tr', 'register', tr);

const RegisterConfig = {
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
			path: '/register',
			component: Register
		}
	]
};

export default RegisterConfig;
