import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../companyApplication-i18n/en";
import tr from "../companyApplication-i18n/tr";

i18next.addResourceBundle('en', 'companyApplications', en);
i18next.addResourceBundle('tr', 'companyApplications', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const CompanyApplicationsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/clientapplist',
            component: React.lazy(() => import('./CompanyApplications'))
        }
    ]
};

export default CompanyApplicationsConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const MainPageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};

export default MainPageConfig;

*/
