import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "../companyApplication-i18n/en";
import tr from "../companyApplication-i18n/tr";
i18next.addResourceBundle('en', 'companyApplications', en);
i18next.addResourceBundle('tr', 'companyApplications', tr);

const MyClientListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [


        {
            path: '/mycompany',
            component: React.lazy(() => import('./MyClients'))
        },
    ]
};

export default MyClientListConfig;
