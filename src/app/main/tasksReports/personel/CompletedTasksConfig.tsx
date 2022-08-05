import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../../task/task-i18n/en";
import tr from "../../task/task-i18n/tr";
i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);


const CompletedTasksConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/completedTasks',
            component: React.lazy(() => import('./CompletedTasks'))
        }
    ]
};
export default CompletedTasksConfig;
