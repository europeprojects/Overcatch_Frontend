import React from 'react';
import { authRoles } from 'app/auth';
const ForgotPasswordPage = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/forgot-password',
			component: React.lazy(() => import('./ForgotPassword'))
		},
		{
			path: '/change-forgat-password/:email/:changeCode?',
			component: React.lazy(() => import('./ChangeForgotPassword'))
		}
	]
};

export default ForgotPasswordPage;
