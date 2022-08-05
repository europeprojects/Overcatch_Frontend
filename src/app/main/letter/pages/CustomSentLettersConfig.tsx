import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../letter-i18n/en";
import tr from "../letter-i18n/tr";

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const CustomSentLettersConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/sent-letters',
			component: React.lazy(() => import('./CustomSentLetters'))
		}
	]
};

export default CustomSentLettersConfig;
