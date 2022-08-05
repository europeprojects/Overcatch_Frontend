import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "./conversion-i18n/en";
import tr from "./conversion-i18n/tr";

i18next.addResourceBundle('en', 'conversion', en);
i18next.addResourceBundle('tr', 'conversion', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ConversionConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/conversion',
            component: React.lazy(() => import('./Conversion'))
        },
        {
            path: '/excelexport',
            component: React.lazy(() => import('./ExcelConvert'))
        },
        {
            path: '/conversions/:transactionId',
            component: React.lazy(() => import('./TransactionDetail'))
        }
    ]
};

export default ConversionConfig;

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
