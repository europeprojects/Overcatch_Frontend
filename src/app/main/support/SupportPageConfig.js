import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
import i18next from "i18next";
import en from "./support-18n/en";
import tr from "./support-18n/tr";
i18next.addResourceBundle('en', 'SupportPage', en);
i18next.addResourceBundle('tr', 'SupportPage', tr);
const SupportPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/support',
            component: React.lazy(() => import('./SupportPage'))
        },
    ]
};

export default SupportPageConfig;
