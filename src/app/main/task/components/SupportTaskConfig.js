import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
import i18next from "i18next";
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const SupportPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/supporttask',
            component: React.lazy(() => import('./SupportTask'))
        },
    ]
};

export default SupportPageConfig;
