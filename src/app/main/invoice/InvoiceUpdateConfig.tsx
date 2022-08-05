import React from 'react';
import {authRoles} from 'app/auth';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const InvoiceUpdateConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/invoice/detail/:id',
            component: React.lazy(() => import('./UpdateInvoice'))
        },
    ]
};

export default InvoiceUpdateConfig;
