import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
import i18next from "i18next";
import en from "../task-i18n/en";
import tr from "../task-i18n/tr";
i18next.addResourceBundle('en', 'task', en);
i18next.addResourceBundle('tr', 'task', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const TaskHomeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/tasks',
            component: React.lazy(() => import('./TaskHome'))
        },
        // {
        //     path: '/documents',
        //     component: () => <Redirect to="/taskhome"/>
        // }
    ]
};

export default TaskHomeConfig;
