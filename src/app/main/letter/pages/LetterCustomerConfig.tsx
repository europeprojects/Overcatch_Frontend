import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../letter-i18n/en";
import tr from "../letter-i18n/tr";

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const LetterCustomerConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/lettercustomer',
            component: React.lazy(() => import('./LetterCustomer'))
        }
    ]
};

export default LetterCustomerConfig;

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
