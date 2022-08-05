import React from 'react';
import { authRoles } from 'app/auth';

// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const DocumentCreateConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/documentcreate',
			component: React.lazy(() => import('./DocumentCreate'))
		}
	]
};

export default DocumentCreateConfig;

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
