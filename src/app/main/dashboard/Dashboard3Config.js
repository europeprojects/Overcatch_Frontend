import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const Dashboard3Config = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/dashboard3',
            component: React.lazy(() => import('./Dashboard3'))
        },
        {
            path: '/dashboard3',
            component: () => <Redirect to="/dashboard3"/>
        }
    ]
};

export default Dashboard3Config;
