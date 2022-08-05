import React from 'react';
import { authRoles } from 'app/auth';


const ModuleTypeManagerConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.anonymous,
	routes: [
		{
			path: '/moduletype',
			component: React.lazy(() => import('./ModuleTypeManager'))
		}
	]
};
export default ModuleTypeManagerConfig;
