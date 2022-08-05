import React from 'react';
import { authRoles } from 'app/auth';

const BankMasterConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/bankmaster',
			component: React.lazy(() => import('./BankMaster'))
		}
	]
};
export default BankMasterConfig;
