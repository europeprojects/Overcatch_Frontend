import React from 'react';
import {authRoles} from 'app/auth';
import {Redirect} from 'react-router-dom';
import i18next from "i18next";
import en from "./documents-i18n/en";
import tr from "./documents-i18n/tr";

i18next.addResourceBundle('en', 'documents', en);
i18next.addResourceBundle('tr', 'documents', tr);
const DocumentsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/documents',
            component: React.lazy(() => import('./Documents'))
        },
        {
            path: '/documents',
            component: () => <Redirect to="/documents"/>
        }
    ]
};

export default DocumentsConfig;
