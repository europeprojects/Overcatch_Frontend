import { authRoles } from 'app/auth';
import i18next from 'i18next';
// import en from './i18n/en';
// import tr from './i18n/tr';
import PasswordChange from "../PasswordChange/PasswordChange";
import en from "./passchange-18n/en";
import tr from "./passchange-18n/tr";

i18next.addResourceBundle('en', 'passwordChange', en);
i18next.addResourceBundle('tr', 'passwordChange', tr);
const PasswordChangeConfig = {
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
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/ChangePassword',
			component: PasswordChange
		}
	]
};

export default PasswordChangeConfig;
