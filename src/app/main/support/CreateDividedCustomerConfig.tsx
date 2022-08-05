import React from 'react';
import { authRoles } from 'app/auth';
import i18next from "i18next";
import en from "../letter/letter-i18n/en";
import tr from "../letter/letter-i18n/tr";

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);

const CreateDividedCustomerConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/creatdividedcustomer',
            component: React.lazy(() => import('./CreateDividedCustomer'))
        }
    ]
};

export default CreateDividedCustomerConfig;