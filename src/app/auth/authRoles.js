/**
 * Authorization Roles
 */
const authRoles = {
	manager: ['MANAGER'],
	employee: ['MANAGER', 'EMPLOYEE'],
	customer: ['CUSTOMER', 'MANAGER', 'EMPLOYEE'],
	anonymous: ['CUSTOMER', 'ANONYMOUS', 'MANAGER', 'EMPLOYEE'],
	onlyGuest: []
};

export default authRoles;
