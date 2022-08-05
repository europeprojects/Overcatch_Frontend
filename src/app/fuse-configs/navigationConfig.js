import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);
const navigationConfig = [
    {
        id: 'mainGroup',
        title: 'Main',
        translate: 'APPLICATIONS',
        type: 'group',
        icon: 'apps',
        required: 'CUSTOMER',
        auth: ['MANAGER', 'CUSTOMER', 'EMPLOYEE'],
        children: [
            {
                id: 'example-component1',
                title: 'Dashboard',
                translate: 'DASHBOARD',
                type: 'item',
                icon: 'whatshot',
                url: '/dashboard',
                auth: ['MANAGER']
            },
            {
                id: 'example-component2',
                title: 'Dashboard',
                translate: 'DASHBOARD',
                type: 'item',
                icon: 'whatshot',
                url: '/dashboard2',
                auth: ['EMPLOYEE']

            },
            {
                id: 'customerDashboard',
                title: 'Dashboard',
                translate: 'DASHBOARD',
                type: 'item',
                icon: 'whatshot',
                url: '/dashboard3',
                auth: ['CUSTOMER']

            }
        ]
    },
    {
        id: 'userpage',
        title: 'User Page',
        translate: 'USERPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['MANAGER', 'EMPLOYEE'],
        children: [
            // {
            //     id: 'example-component3',
            //     title: 'User Add',
            //     translate: 'USERCREATE',
            //     type: 'item',
            //     icon: 'person_add',
            //     auth: ['MANAGER', 'EMPLOYEE'],
            //     url: '/usercreate'
            // },

            {
                id: 'example-component4',
                title: 'Users',
                translate: 'USERS',
                type: 'item',
                icon: 'person',
                auth: ['MANAGER', 'EMPLOYEE'],
                url: '/users',
            }
        ]
    },
    {
        id: 'companyPageGroup',
        title: 'Company Page',
        translate: 'CLIENTPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['MANAGER','EMPLOYEE', "CUSTOMER"],
        children: [
            {
                id: 'applicationPage',
                title: 'Applications',
                translate: 'CLIENTAPP',
                type: 'item',
                icon: 'apps',
                auth: ['MANAGER', 'CUSTOMER', 'EMPLOYEE'],
                url: '/clientapplist',
            },

            {
                id: 'example-component4',
                title: 'Client List',
                translate: 'CLIENTS',
                auth: ['MANAGER', 'EMPLOYEE'],
                type: 'item',
                icon: 'business',
                url: '/clients',
            },
        ]
    },
    {
        id: 'taskpage',
        title: 'Task Page',
        translate: 'TASKPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['MANAGER', 'EMPLOYEE'],
        children: [
            {
                id: 'example-component3',
                title: 'Company Create',
                translate: 'TASKS',
                type: 'item',
                icon: 'work',
                auth: ['MANAGER', 'EMPLOYEE'],
                url: '/tasks'
            }
        ]
    },

    {
        id: 'taskclient',
        title: 'Task Page',
        translate: 'TASKCLIENTPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['CUSTOMER'],
        children: [
            {
                id: 'example-component53',
                title: 'Company Create',
                translate: 'CLIENTTASKS',
                type: 'item',
                icon: 'work',
                url: '/ClientTasks'
            }
        ]
    },
    {
        id: 'documentpage',
        title: 'Document Page',
        translate: 'DOCUMENTPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['CUSTOMER'],
        children: [
            {
                id: 'create-document',
                title: 'Document Create',
                translate: 'DOCUMENTCREATE',
                type: 'item',
                icon: 'attach_file',
                auth: ['CUSTOMER'],
                url: '/documentcreate'
            },
        ]
    },
    {
        id: 'letterPages',
        title: 'Letter Page',
        translate: 'LETTERPAGE',
        type: 'group',
        icon: 'person_pin',
        auth: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'],
        children: [
            // {
            //     id: 'letter-template',
            //     title: 'Letter Templates',
            //     translate: 'LETTEREMPLOYEE',
            //     type: 'item',
            //     icon: 'library_add',
            //     auth: ['EMPLOYEE', 'MANAGER'],
            //     url: '/letteremployee'
            // },
            {
                id: 'letter-template',
                title: 'Letter Templates',
                translate: 'LETTERTEMPLATES',
                type: 'item',
                icon: 'library_add',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/letter-templates'
            },
            {
                id: 'letter-create-employee',
                title: 'Letter Templates',
                translate: 'CREATELETTER',
                type: 'item',
                icon: 'library_add',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/createletteremployee'
            },
            {
                id: 'divided-create-employee',
                title: 'divided Templates',
                translate: 'CREATEDIVIDED',
                type: 'item',
                icon: 'library_add',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/creatdividedcustomer'
            },
            {
                id: 'custom-sent-letters',
                title: 'Sent Letters',
                translate: 'SENTLETTERS',
                type: 'item',
                icon: 'library_add',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/sent-letters'
            },
            {
                id: 'custom-created-divided',
                title: 'Created Divided',
                translate: 'CREATEDDIVIDEND',
                type: 'item',
                icon: 'library_add',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/created-divided'
            },
            {
                id: 'letter-customer',
                title: 'Create Letter Request',
                translate: 'LETTERCUSTOMER',
                type: 'item',
                icon: 'library_add',
                auth: ['CUSTOMER'],
                url: '/lettercustomer'
            },
            {
                id: 'letter-customer-list',
                title: 'My Letters',
                translate: 'LETTERLIST',
                type: 'item',
                icon: 'sticky_note_2',
                auth: ['CUSTOMER'],
                url: '/myLetters'
            }
        ]
    },
    {
        id: 'supportPages',
        title: 'Support',
        translate: 'SUPPORTPAGE',
        type: 'group',
        icon: 'support_agent',
        auth: ['CUSTOMER','MANAGER'],
        children: [
            {
                id: 'support-create',
                title: 'Create Support Request',
                translate: 'SUPPORTCREATE',
                type: 'item',
                icon: 'help_center',
                auth: ["CUSTOMER"],
                url: '/support'
            },
            {
                id: 'support-list',
                title: 'My Support Requests',
                translate: 'SUPPORTLIST',
                type: 'item',
                icon: 'live_help',
                auth: ['CUSTOMER'],
                url: '/supportlist'
            },
            {
                id: 'support-settings',
                title: 'Create Support Settings',
                translate: 'SUPPORTSETTINGS',
                type: 'item',
                icon: 'library_add',
                auth: ['MANAGER'],
                url: '/supportSettings'
            }
        ]
    },
    {
        id: 'example-component50',
        title: 'Information',
        translate: 'EXPENSESTYPE',
        type: 'group',
        icon: 'account_balance',
        auth: ['MANAGER'],
        children: [
            {
                id: 'example-component51',
                title: 'Information',
                translate: 'EXPENSESTYPE',
                auth: ['MANAGER'],
                type: 'item',
                icon: 'monetization_on',
                url: '/expensestype',
            },
            {
                id: 'example-component51',
                title: 'Information',
                translate: 'INCOMETYPE',
                auth: ['MANAGER'],
                type: 'item',
                icon: 'monetization_on',
                url: '/incometype',
            }
        ]
    },
    {
        id: 'example-component52',
        title: 'Information',
        translate: 'MODULETYPESETTINGS',
        type: 'group',
        icon: 'account_balance',
        auth: ['MANAGER'],
        children: [
            {
                id: 'example-component53',
                title: 'Information',
                translate: 'MODULETYPESETTINGS',
                auth: ['MANAGER'],
                type: 'item',
                icon: 'monetization_on',
                url: '/moduletype'
            }
        ]
    },

	{
		id: 'example-component53',
		title: 'Information',
		translate: 'ADDBANKNAME',
		type: 'group',
		icon: 'account_balance',
		auth: ['MANAGER'],
		children: [
			{
				id: 'example-component54',
				title: 'Information',
				translate: 'ADDBANKNAME',
				auth: ['MANAGER'],
				type: 'item',
				icon: 'monetization_on',
				url: '/bankmaster'
			}
		]
	},
    //{
    //   id: 'statementpage',
    // title: 'Statement Page',
    // translate: 'STATEMENT',
    // type: 'group',
    // icon: 'person_pin',
    // auth: ['CUSTOMER','EMPLOYEE', 'MANAGER'],
    // children: [
    //    {
    //     id: 'example-component16',
    //     title: 'Applications',
    //     translate: 'CONVERSION',
    //     type: 'item',
    //     icon: 'person_add',
    //     auth: ['CUSTOMER'],
    //     url: '/conversion',
    //    },
    // {
    // id: 'example-component30',
    // title: 'Applications',
    // translate: 'EXPORTSERVICE',
    // type: 'item',
    // icon: 'import_export',
    // auth:  ['EMPLOYEE', 'MANAGER'],
    // url: '/excelexport',
    // },
    // ]
    // },
    {
        id: 'example-component42',
        title: 'Information',
        translate: 'REPORTS',
        type: 'group',
        icon: 'account_balance',
        auth: ['CUSTOMER','MANAGER','EMPLOYEE'],
        children: [
            {
                id: 'example-component43',
                title: 'Information',
                translate: 'INCOMEEXPENSEREPORTS',
                auth: ['CUSTOMER'],
                type: 'item',
                icon: 'monetization_on',
                url: '/incomeExpenseReport',
            },
            {
                id: 'example-component44',
                title: 'Information',
                translate: 'CLIENTSINCOMEEXPENSEREPORTS',
                auth: ['MANAGER','EMPLOYEE'],
                type: 'item',
                icon: 'monetization_on',
                url: '/clientsIncomeExpenseReport',
            }
        ]
    },
    {
        id: 'invoicepages',
        title: 'Invoice',
        translate: 'INVOICE',
        type: 'group',
        icon: 'person_pin',
        auth: ['CUSTOMER'],
        children: [
            {
                id: 'example-component16',
                title: 'Invoice Settings',
                translate: 'INVOICESETTINGS',
                type: 'item',
                icon: 'settings',
                auth: ['CUSTOMER'],
                url: '/invoicesettings',
            },
            {
                id: 'example-component17',
                title: 'Customerff List',
                translate: '' +
                    'BILLRECEIPENTS',
                type: 'item',
                icon: 'format_list_bulleted',
                auth:  ["CUSTOMER"],
                url: '/billrecipients',
            },
            {
                id: 'example-component30',
                title: 'Create Invoice',
                translate: 'CREATEINVOICE',
                type: 'item',
                icon: 'receipt',
                auth:  ["CUSTOMER"],
                url: '/newinvoice',
            },
            {
                id: 'example-component32',
                title: 'Cash Invoice',
                translate: 'EXPENSES',
                type: 'item',
                icon: 'receipt',
                auth:  ["CUSTOMER"],
                url: '/cashinvoice',
            },
            {
                id: 'example-component75',
                title: 'Income',
                translate: 'INCOME',
                type: 'item',
                icon: 'receipt',
                auth:  ["CUSTOMER"],
                url: '/incomenew',
            },
            {
                id: 'example-component31',
                title: 'Invoice List',
                translate: 'INVOICELIST',
                type: 'item',
                icon: 'format_list_bulleted',
                auth:  ["CUSTOMER"],
                url: '/invoicelist',
            },
        ]
    },
    {
        id: 'example-component38',
        title: 'Information',
        translate: 'INFORMATION',
        type: 'group',
        icon: 'person_pin',
        auth: ['CUSTOMER'],
        children: [
            {
                id: 'example-component38',
                title: 'Information',
                translate: 'MYINFORMATION',
                auth: ['CUSTOMER'],
                type: 'item',
                icon: 'business',
                url: '/mycompany',
            }
        ]
    },
    {
        id: 'notification',
        title: 'Notification',
        translate: 'NOTIFICATION',
        type: 'group',
        icon: 'person_pin',
        auth: ['MANAGER'],
        children: [
            {
                id: 'example-component33',
                title: 'Notification',
                translate: 'NOTIFICATION',
                type: 'item',
                icon: 'notifications',
                auth: ['MANAGER'],
                url: '/notification',
            },
            {
                id: 'example-component34',
                title: 'Notification Create',
                translate: 'NOTİFCREATE',
                type: 'item',
                icon: 'add_alert',
                auth: ['MANAGER'],
                url: '/notifcreate',
            },
        ]
    },
    {
        id: 'ReminderPage',
        title: 'Reminder Page',
        translate: 'REMINDERPAGE',
        type: 'group',
        icon: 'notifications_none',
        auth: ['EMPLOYEE', 'MANAGER'],
        children: [
            {
                id: 'reminder-list',
                title: 'Reminder List',
                translate: 'REMINDERLIST',
                type: 'item',
                icon: 'update_two_one',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/ReminderList'
            },
            {
                id: 'create-reminder-template',
                title: 'Reminder Templates',
                translate: 'REMINDERTEMPLATE',
                type: 'item',
                icon: 'date_range',
                auth: ['EMPLOYEE', 'MANAGER'],
                url: '/ReminderTemplate'
            }
        ]
    },

];


export default navigationConfig;
