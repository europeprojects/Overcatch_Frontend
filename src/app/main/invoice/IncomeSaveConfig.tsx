import React from 'react';
import {authRoles} from 'app/auth';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const IncomeSaveConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/incomesave',
            component: React.lazy(() => import('./IncomeSave'))
        },
    ]
};

export default IncomeSaveConfig;