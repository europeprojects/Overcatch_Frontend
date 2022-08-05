import React from 'react';
import { authRoles } from 'app/auth';

// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ConversionConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/bankTransaction',
            component: React.lazy(() => import('./BankTransaction'))
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
