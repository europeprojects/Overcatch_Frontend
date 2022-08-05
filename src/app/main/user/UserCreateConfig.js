import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from './user-i18n/en'
import tr from './user-i18n/tr'

i18next.addResourceBundle('en', 'usercreate', en);
i18next.addResourceBundle('tr', 'usercreate', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const UserCreateConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.employee,
	routes: [
		{
			path: '/usercreate',
			component: React.lazy(() => import('./UserCreate'))
		}
	]
};

export default UserCreateConfig;

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
