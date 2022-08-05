import React from 'react';
import {authRoles} from 'app/auth';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const IncomeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/incomenew',
            component: React.lazy(() => import('./Income'))
        },
    ]
};

export default IncomeConfig;