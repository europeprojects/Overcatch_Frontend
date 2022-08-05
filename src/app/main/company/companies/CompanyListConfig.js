import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "../companyApplication-i18n/en";
import tr from "../companyApplication-i18n/tr";
i18next.addResourceBundle('en', 'companyApplications', en);
i18next.addResourceBundle('tr', 'companyApplications', tr);

const CompanyListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.employee,
    routes: [
        // {
        //     path: '/tasks/detail',
        //     component: React.lazy(() => import('./task/Task'))
        // },
        {
            path: '/clientapp/detail',
            component: React.lazy(() => import('../companyDetail/CompanyDetail'))
        },
        {
            path: '/clients',
            component: React.lazy(() => import('./Companies'))
        }
    ]
};

export default CompanyListConfig;
