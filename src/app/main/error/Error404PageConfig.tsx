import React from 'react';
import {authRoles} from "../../auth";import i18next from "i18next";
import en from "./error-i18n/en";
import tr from "./error-i18n/tr";

i18next.addResourceBundle('en', 'errorPage', en);
i18next.addResourceBundle('tr', 'errorPage', tr);

const Error404PageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/error-404',
            component: React.lazy(() => import('./Error404Page'))
        }
    ]
};

export default Error404PageConfig;