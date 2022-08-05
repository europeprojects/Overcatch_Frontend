import React from 'react';
import {authRoles} from 'app/auth';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ExpencesTypeManagerConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/expensestype',
            component: React.lazy(() => import('./ExpensesTypeManager'))
        }
    ]
};

export default ExpencesTypeManagerConfig;
