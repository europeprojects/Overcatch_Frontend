import React from 'react';
import {authRoles} from 'app/auth';
import en from "../task/task-i18n/en";
import tr from "../task/task-i18n/tr";
import i18next from "i18next";
i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ReminderConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.manager,
    routes: [
        {
            path: '/notifcreate',
            component: React.lazy(() => import('./notifCreate'))
        }
    ]
};

export default ReminderConfig;
