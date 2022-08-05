import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
import i18next from 'i18next';
import en from './dashboard-i18n/en'
import tr from './dashboard-i18n/tr'


i18next.addResourceBundle('en', 'dashboard1', en);
i18next.addResourceBundle('tr', 'dashboard1', tr);

const Dashboard1Config = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.manager,
    routes: [
        {
            path: '/dashboard',
            component: React.lazy(() => import('./Dashboard1'))
        },
        {
            path: '/dashboard',
            component: () => <Redirect to="/dashboard"/>
        }
    ]
};

export default Dashboard1Config;
