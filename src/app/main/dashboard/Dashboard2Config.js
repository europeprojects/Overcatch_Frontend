import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const Dashboard2Config = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.employee,
    routes: [
        {
            path: '/dashboard2',
            component: React.lazy(() => import('./Dashboard2'))
        },
        {
            path: '/dashboard2',
            component: () => <Redirect to="/dashboard2"/>
        }
    ]
};

export default Dashboard2Config;
