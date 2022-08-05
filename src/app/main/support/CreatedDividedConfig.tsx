import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../letter/letter-i18n/en";
import tr from "../letter/letter-i18n/tr";

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const CreatedDividedConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/created-divided',
            component: React.lazy(() => import('./CreatedDivided'))
        }
    ]
};

export default CreatedDividedConfig;
