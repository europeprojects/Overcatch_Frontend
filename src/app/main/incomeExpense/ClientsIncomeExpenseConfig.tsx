import React from 'react';
import {authRoles} from 'app/auth';
import i18next from "i18next";
import en from "./incomeExpense-i18n/en";
import tr from "./incomeExpense-i18n/tr";
i18next.addResourceBundle('en', 'incomeExpense', en);
i18next.addResourceBundle('tr', 'incomeExpense', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ClientsIncomeExpenseConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/clientsIncomeExpenseReport',
            component: React.lazy(() => import('./ClientsIncomeExpense'))
        },
    ]
};

export default ClientsIncomeExpenseConfig;
