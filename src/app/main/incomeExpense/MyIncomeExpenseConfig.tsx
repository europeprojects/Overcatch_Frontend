import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "./incomeExpense-i18n/en";
import tr from "./incomeExpense-i18n/tr";
i18next.addResourceBundle('en', 'incomeExpense', en);
i18next.addResourceBundle('tr', 'incomeExpense', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const MyIncomeExpenseConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/incomeExpenseReport',
            component: React.lazy(() => import('./MyIncomeExpense'))
        },
    ]
};

export default MyIncomeExpenseConfig;
