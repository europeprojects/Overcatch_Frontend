import React from 'react';
import {authRoles} from 'app/auth';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const NotificationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.manager,
    routes: [
        {
            path: '/notification',
            component: React.lazy(() => import('./notification'))
        }
    ]
};

export default NotificationConfig;
