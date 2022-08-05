import React from 'react';
import { authRoles } from 'app/auth';
import { Redirect } from 'react-router-dom';
import i18next from "i18next";
import en from "./user-i18n/en";
import tr from "./user-i18n/tr";

i18next.addResourceBundle('en', 'usercreate', en);
i18next.addResourceBundle('tr', 'usercreate', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const UsersConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.employee,
    routes: [
        {
            path: '/users',
            component: React.lazy(() => import('./Users'))
        },
        {
            path: '/users',
            component: () => <Redirect to="/users" />
        }
    ]
};

export default UsersConfig;

