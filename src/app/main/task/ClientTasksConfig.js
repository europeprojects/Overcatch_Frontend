import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "./task-i18n/en";
import tr from "./task-i18n/tr";

i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);

const ClientTasksConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/ClientTasks',
            component: React.lazy(() => import('./ClientTasks'))
        },

    ]
};

export default ClientTasksConfig;
