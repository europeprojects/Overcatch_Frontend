import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import tr from "../letter/letter-i18n/tr";
import en from "../letter/letter-i18n/en";
i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);

const ReminderListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/ReminderList',
            component: React.lazy(() => import('./ReminderList'))
        }
    ]
};

export default ReminderListConfig;