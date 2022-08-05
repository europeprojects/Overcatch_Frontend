import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "../document/documents-i18n/en";
import tr from "../document/documents-i18n/tr";
i18next.addResourceBundle('en', 'document', en);
i18next.addResourceBundle('tr', 'document', tr);
const CashSaveConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/cashSave',
            component: React.lazy(() => import('./CashSave'))
        }
    ]
};
export default CashSaveConfig;
