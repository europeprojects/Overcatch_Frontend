import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "./support-18n/en";
import tr from "./support-18n/tr";
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

i18next.addResourceBundle('en', 'SupportList', en);
i18next.addResourceBundle('tr', 'SupportList', tr);

const SupportPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/supportlist',
            component: React.lazy(() => import('./SupportList'))
        },
    ]
};

export default SupportPageConfig;
