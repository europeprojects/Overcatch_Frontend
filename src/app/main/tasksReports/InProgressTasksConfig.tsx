import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "../task/task-i18n/en";
import tr from "../task/task-i18n/tr";

i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const InProgressTasksConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.employee,
    routes: [
        {
            path: '/inProgressAll',
            component: React.lazy(() => import('./InProgressTasks'))
        },
        // {
        //     path: '/tasks/list/:moduleType',
        //     component: React.lazy(() => import('./tasks/Tasks'))
        // },
    ]
};

export default InProgressTasksConfig;
