import React from 'react';
import authRoles from "../../auth/authRoles";
import {Redirect} from "react-router";
import i18next from "i18next";
import en from "./profile-18n/en";
import tr from "./profile-18n/tr";


i18next.addResourceBundle('en', 'profile', en);
i18next.addResourceBundle('tr', 'profile', tr);

const ProfilePageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.anonymous,
    routes: [
        {
            path: '/profile',
            component: React.lazy(() => import('./ProfilePage'))
        },
        {
            path: '/profile',
            component: () => <Redirect to="/profile"/>
        }

    ]
};

export default ProfilePageConfig;
