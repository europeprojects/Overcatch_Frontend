import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "./task-i18n/en";
import tr from "./task-i18n/tr";

i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const TasksConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.employee,
    routes: [
        {
            path: '/tasks/detail/:taskid',
            component: React.lazy(() => import('./task/TaskDetailSelective'))
        },
        {
            path: '/tasks/list/:moduleType',
            component: React.lazy(() => import('./tasks/Tasks'))
        },
        {
            path: '/tasks/AdminAndSupport/:moduleType',
            component: React.lazy(() => import('./components/AdminAndSupport'))
        },
    ]
};

export default TasksConfig;
