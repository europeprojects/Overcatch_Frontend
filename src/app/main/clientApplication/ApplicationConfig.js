import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "./clientApplication-i18n/en";
import tr from "./clientApplication-i18n/tr";

i18next.addResourceBundle('en', 'application', en);
i18next.addResourceBundle('tr', 'application', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ApplicationConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/client/apply/founder',
			component: React.lazy(() => import('./FounderOwnerApply'))
		},
		{
			path: '/client/apply/limited',
			component: React.lazy(() => import('./LimitedApply'))
		}
	]
};

export default ApplicationConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const MainPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};

export default MainPageConfig;

*/
