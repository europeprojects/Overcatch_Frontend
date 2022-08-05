import React from 'react';

const locale = {
	//TaskHome.tsx
	TODAY: 'Today',
	YESTERDAY: 'Yesterday',
	LASTWEEK: 'Last Week',
	ADMINTASKS: 'Admin',
	PENDING: 'Pending',
	INPROCESS: 'In Process',
	INPROGRESS: 'In Progress',
	REJECTED: 'Rejected',
	PAYROLLTASKS: 'Payroll',
	SUPPORTPAGE: 'Support Page',
	INFO: 'Info',
	DOCUMENTS: 'Documents',
	DOCUMENTNAME: 'Document Name',
	DATE: 'Date',
	DELETE: 'Delete',
	VATTASKS: 'VAT',
	COMPANYYEAREND: 'Company Year End',
	SOLETRADERACCOUNTS: 'Sole Trader Accounts',
	SELFASSESMENT: 'Self Assesment',
	VISAEXTENSION: 'Visa Extension',
	MANAGER: 'Manager',
	SUPPORT: 'Support',

	//TasksHeaher.js
	TASKS: 'Tasks',
	SEARCH: 'Search',
	LETTERTASK: 'Letter Task',
	BACKTOMODULES: 'Back to Modules',
	EXPENSEDELETEREQUEST:'Expense Delete Request',
	INCOMEDELETEREQUEST:'Income Delete Request',
	EXPENSEUPDATEREQUEST:'Expense Update Request',
	INCOMEUPDATEREQUEST:'Income Update Request',
	INVOICEUPDATEREQUEST:'Invoice Update Request',
	SAVELETTER:'Save Letter',
	EDITLETTER:'Edit Letter',
	EXPENSEDETAILS:'Expense Detail',
	SELECTSTATE:'Select State',

	//InvoiceList.tsx
	INVOICEDATE:'Invoice Date',
	SELECTDATEFORFILTER:'Select date for filter ',
	INVOICEENDDATE:'Invoice End Date',
	INVOICELIST:'Invoice List',
	INVOICECODE:'Invoice Code',
	INVOICETYPE:'Invoice Type',
	INVOICERECIPIENT:'Bill Recipient',
	INVOICECURRENCY:'Currency',
	INVOICETOTAL:'Total',
	INVOICESTATE:'State',
	INVOICEACTION:'Select Action',
	INVOICECLICK:'Click to download',
	INVOICEUPDATE:'Update Request',
	INVOICEUPDELETE:'Delete Invoice',
	UPDATEREJECTED:'Update request rejected',
	DELETEREJECTED:'Delete request rejected',
	INVOICECOPY:'Copy Invoice',
	INVOICEREQUEST:'Request can be made',
	INVOICEDELETEREQUEST:'Waiting Delete Request Response.',
	INVOICEUPDATEQUEST:'Waiting Update Request Response.',
	INVOICEUPDATED:'Invoice can be updated',
	INVOICEDELETE:'Delete invoice ?',
	INVOICEDIALOG:'Are you sure you want to permanently remove this item?',
	INVOICEUPDATEREQUESTT:'Update invoice Request?',
	INVOICEDIALOGUPDATE:'Are you sure you want to permanently Update this item?',
	INVOICEUPDATEDIALOG:'Are you sure to update this item?',
	INVOICEWAITING:'Waiting Update Response',
	INVOICEDUEDATE:'Due Date',
	INVOICESELECTRECIPIENT:'Select Bill Recipient',
	INVOICESELECTRECIPIENTPLEASE:'Please Add Bill Recipient',
	INVOICEPOUND:'Pound Sterling (GBP)',
	INVOICESELECT:'Select Bank Account',
	INVOICEADD:'Please Add Account',
	INVOICEDETAILS:'Invoice Details',
	INVOICEADDLINE:'Add New Line',
	ITEMDESCRIPTION:'Item Description',
	AMOUNT:'Amount',
	INVOICEUNITPRICE:'Unit Price',
	INVOICEQUANTITY:'Quantity',
	INVOICEVATRATE:'VAT Rate',
	INVOICEVATAMOUNT:'VAT Amount',
	INVOICESUBTOTAL:'Sub Total :',
	INVOICEPREVIEW:'Preview & Save',
	INVOICEALERTADDINVOICE:'Please Add Invoice Detail',
	INVOICEALERTBILLRECIPIENT:'Please Select Bill Recipient',
	INVOICEALERTSELECTACCOUNT:'Please Select Account',
	INVOICEALERTSELECTCURRENCYTYPE:'Please Select Currency Type',
	INVOICEALERTINVOICETYPE:'Please Invoice Type',
	INVOICEALERTINVOICEDATE:'Please Select Invoice Date',
	INVOICEALERTPOSITIVEUNITDATE:'Please Enter Positive Unit Price',
	INVOICEALERTPOSITIVEQUANTITY:'Please Enter Positive Quantity',
	INVOICEALERTPOSITIVEVATRATE:'Please Enter Positive Vat Rate',
	INVOICEALERTVATMAX:'Vat Rate Can be max 100',

	//InvoiceCreate.tsx
	INVOICECREATE:'Invoice Create',

	//TaskList.tsx
	TASKID: 'Task Id',
	MODULETYPE: 'Module Type',
	ORDERDATE: 'Order Date',
	CUSTOMERFULLNAME: 'Customer Full Name',
	CLIENTFULLNAME: 'Client Full Name',
	APPLYFULLNAME: 'Apply Full Name',
	CLIENTTYPE: 'Client Type',
	AGREEMENTTYPE: 'Agreement Type',
	CONFIRMORDERDATE: 'Confirm Order Date',
	APPROVEDSTAFF: 'Aprooved Staff',
	CONFIRMTYPE: 'Confirm Type',
	SORTEDDESC: 'sorted descending',
	CONFIRMDATE: "Confirm Date",

	DEFAULT: 'Pending',
	LETTER_MODULE: 'Letter Module',
	COMPANY_CREATE: 'Company Create',
	INVOICE_DELETE: 'Invoice Delete',
	INVOICE_UPDATE: 'Invoice Update',
	EXPENSE_DELETE: 'Expense Delete',
	EXPENSE_UPDATE:'Expense Update',
	INCOME_UPDATE: 'Income Update',
	INCOME_DELETE: 'Income Delete',
	SUPPORT_ADMIN: 'Support - Admin',

	//ApplicationTask.tsx
	BUSINESSDETAILS: 'Business Details',
	DIRECTOR: 'Director',
	ADDRESSDETAILS: 'Address Details',
	DOCUMENTDETAILS: 'Document Details',
	CONFIRMATION: 'Confirmations',
	INCOMESDETAIL:'Income Detail',
	DONE: 'Done',
	DENIED: 'Denied',
	CONFIRMMESSAGE: 'Confirm Message',
	CLOSE: 'Close',
	SAVE: 'Save',
	SAVEDOCUMENT: 'Save Document',
	PLEASESELECT: 'Please Select',
	BUSINESSNAME: 'Business Name',
	BUSINESSEMAIL: 'Business Email',
	BUSINESSPHONE: 'Business Phone',
	YEARENDDATE: 'Year End Date',
	DUEDATE: 'Due Date',
	REGISTRATIONNUMBER: 'Registration Number',
	STATUS: 'Status',
	SUPPORTTYPE: 'Support Type',
	AUTHENTICATIONCODE: 'Authentication Code',
	NATIONALITY: 'Nationality',
	NATUREBUSINESSINFO: 'Nature Business Info',
	CODE: 'Code',
	DESCRIPTION: 'Description',
	FORENAME: 'Forename',
	LASTNAME: 'LastName',
	EMAIL: 'Email',
	PHONENUMBER: 'Phone Number',
	DOB:'Date of Birthday',
	DATEOFBIRTHDAY: 'Date of Birth',
	SEX: 'Sex',
	PLEASEENTER: 'Please Select',
	MALE: 'Male',
	FEMALE: 'Female',
	NINO: 'NINO Number',
	UTR: 'UTR Number',
	MARITALSTATUS: 'Marital Status',
	SPOUSENAME: 'Spouse Name',
	NEXTOFKINDESCRIPTION: 'Next of Kin Details',
	MARRIED: 'Married',
	SINGLE: 'Single',
	ADDRESSLIST: 'Address List',
	TYPE: 'Type',
	BUILDINGNUMBER: 'Building Number',
	STREETNAME: 'Street Name',
	COUNTY: 'County',
	TOWNCITY: 'Town / City',
	POSTCODE: 'Post Code',
	LINE1: 'Line 1',
	LINE2: 'Line 2',
	LINE3: 'Line 3',
	LINE4: 'Line 4',
	LINE5: 'Line 5',
	HOME: 'Home',
	BUSINESS: 'Business',
	DOCUMENTTYPE: 'Document Type',
	FILENAME: 'File Name',
	ORIGINALFILENAME: 'Original File Name',
	FILEDESCRIPTION: 'File Description',
	DOCUMENTLIST: 'Document List',
	DOWNLOADDOCUMENT: 'Download Document',
	PROCESSDATE: 'Process Date',
	PRIORTIYLEVEL: 'Priority Level',
	STAFFTYPE: 'Staff Type',
	PREVIOUS: 'Previous',
	NEXT: 'Next',
	FOREANDLASTNAME: 'Fore And Last Name',
	ADDRESS: 'Address',
	DOWNLOAD: 'Download',
	CLIENT: 'Client',
	MINLENGTH4: 'Min character length is 4',
	MINLENGTH10: 'Min character length is 10',
	CANTGO: "You can't go",
	RESIDENTIALADDRESS: 'Residential Address',
	COMPANYREGISTERADDRESS: 'Company Register Address',
	BUSINESSTRADINGADDESS: 'Business / Trading Address',
	WORKSTARTDATE: 'Work Start Date',
	COUNTRY: 'Country',
	INCOMESTYPE:'Incomes Type',

	//LetterTask.tsx
	CONFIRMATIONS: 'Confirmations',
	LETTERDETAIL: 'Letter Detail',
	APPLICATIONTASKS: 'Application Tasks',
	PREVIEW: 'Preview',
	PREVIEWLETTER: 'Preview Letter',

	//FileList.tsx
	DELETEFILE: 'Delete File?',
	DELETESURE: 'Are you sure you want to delete?',
	UPDATESURE: 'Are you sure you want to update?',
	YES: 'YES',
	NO: 'NO',
	DELETEFILES: 'Delete Selected Files?',
	DELETESELECTED: 'Are you sure you want to delete selected?',

	//UploadPersonel.tsx
	OTHER: 'Other',

	//InvoiceUpdate.tsx
	INVOICE: 'INVOICE',
	SERVICE: 'SERVICE',
	UNIT: 'UNIT',
	UNITPRICE: 'UNIT PRICE',
	QUANTITY: 'QUANTITY',
	TOTAL: 'TOTAL',
	SUBTOTAL: 'SUBTOTAL',
	TAX: 'TAX',
	PLEASEPAYWITHIN: 'Please pay within ',
	THANKFORBUSINESS: ' days. Thank you for your business.',

	//SupportTask.tsx
	DETAILS: 'Details',
	RESPONSE: 'Response',

	//SupportTaskDetail.tsx
	TITLE: 'Title',
	NOTES: 'Notes',
	STARTDATE: 'Start Date',
	ADD: 'Add',

	//CompanyDetail.tsx
	PRODUCT: 'PRODUCT',
	PRICE: 'PRICE',
	DISCOUNT: 'DISCOUNT',

	//ChangeForgotPassword.js
	RECOVERYOURPASSWORD: 'RECOVER YOUR PASSWORD',
	NEWPASSWORD: 'New Password',
	REPEATPASSWORD: 'Repeat Password',
	GOBACKLOGIN: 'Go back to login',
	CHANGEPASSWORD: 'Change Password',
	PASSNOTMACHED: 'Passwords not matched',
	PASSWORDRESETLINK:'Password reset link has been sent to your e-mail. Redirecting...',

	//ForgotPassword.js
	SENDRESETLINK: 'SEND RESET LINK',

	//notifCreate.tsx
	NOTIFICATIONCREATE: 'Notification Create',
	NOTIFICATIONSEND: 'Notification Send',
	NOTIFICATIONLIST: 'Notification Mailing List',
	NOTIFICATIONLISTS: 'Notifications List',
	FILESIZE: 'Please do not upload the file size more than 20 Mb',
	SHOWNOTIFICATIONLIST: 'Show Notification Mailing List',
	SHOWNALLCLIENT: 'Show All Clients',
	NOTIFICATIONSUBJECT: 'Please enter the notification subject .',
	NOTIFICATIONSELECTMAILS: 'Please select the emails to send notifications .',
	NOTIFICATIONCONTENT: 'Please enter the notification content .',
	ALL: 'All',
	SOLETRADER: 'Sole Trader',
	LIMITED: 'Limited',
	COMPANYNAME: 'Company Name',
	FIRSTORLASTNAME: 'First or Lastname',
	SELFASSESMENTNOTI: 'Self Assesment',
	SEARCHCLEAR: 'Clear',
	TRADING: 'Trading',
	ECAA: 'Ecaa',
	OTHERNOTI: 'Other',
	VAT: 'Vat',
	NOTVAT: 'Not Vat',
	MAIL: 'Mail',
	SMS: 'Sms',
	APP: 'App',
	FROMWHERE: 'From Where',
	SUBJECT: 'Subject',
	CONTENT: 'Content',
	SEND: 'SEND',
	NOTIFICATIONSHASBEENSENT: 'Notifications has been sent.',
	NOTIFICATIONSCOULDNTSEND: "Notifications couldn't send",
	NOTIFICATIONSCHECKMAIL: 'Please Make your notification selection .',
	DIRECTORNAME: 'Director',
	DIRECTOREMAIL: 'Director Email',
	EXCEL:'Download Notification Mailing List',
	//EXCEL Yeni Eklendi

	//notification.tsx
	SELECTED: 'selected',
	NOTIFICATION: 'Notification',
	DENSEPADDING: 'Dense padding',
	COMPANY: 'Company',
	PROCESSTIME: 'Process time',
	NOTIFICATIONTYPE: 'Notification Type',
	NOTIFICATIONTO: 'Notification To',
	MESSAGE: 'Message',
	FIRSTANDLASTNAME: 'First and Lastname',
	WAIT: 'Please wait . Your Support Request is being sent ...',
	RESENDMAIL: '  Please wait . Your notification is being sent again ...',
	STARTDATETIME: 'Start Date Time',
	ENDDATETIME: 'End Date Time',
	CREATEDDATETIME:'Created Date Time',


//ReminderEditComponent.tsx
	ENTERRICHTEXT: "Enter some rich text…",
	REMINDERTEMPLATELIST:'Reminder Template Lists',
	REMINDERTEMPLATENAME:'Reminder Template Topic',
	REMINDERTEMPLATEDATE:'Template Creation Date',
	REMINDERTEMPLATEDETAIL:'Template Details',
	REMINDERTEMPLATELISTS:'Template Lists',
	REMINDERTEMPLATEDETAILANDUSERS:'Reminder template details and user states .',
	REMINDERTEMPLATEREPLYDATE:'Reply Date of Reminder',
	REMINDERTEMPLATERESPONSIVE:'Reminder status',
	REMINDERWASSENT:'Email to which reminder was sent',
	REMINDERSUBJECT:'Reminder Topic',
	REMINDERCONTENT:'Reminder Message Content',
	REMINDERUPDATE:'Reminder Template Updated .',
	REMINDERWARNING:'Please fill in the Reminder template information',
	REMINDERUSED:'Template Used',
	REMINDERDELETE:'Reminder Template Deleted .',
	REMINDERREQUESTDELETE:'You cannot delete an actively used reminder template !',
	REMINDERNOANSWER:'No Answer',
	REMINDERANSWER:'Answered',
	REMINDERDATEFIND:'None',
	REMINDERTYPE:'Reminder Type',

//SupportSettings.tsx
	TOPİC:"Topic",
	RESPONSIBLEEMAIL:"Responsible E-Mail",
	CLOSEDURATION:"Close Duration",
	ACTION:"Action",
	NEWEXPENSESTYPE:"Add New Expense Type",
	EXPENSESTYPESETTINGS:"Expense Type Settings",
	EXPENSESSETTINGS:"Expenses Type List",
	NEWEXPENSES: "New Expenses Type",
	SUPPORTSETTINGS:"Support Settings",
	TOPICOFREQUEST:"Topic of Request",
	SAVECHANGES:"Save Changes",
	SUPPORTTOPICLIST:'Support Topic List',
	ADDNEWSUPPORT:'Add New Support',
	//***

	//TaskHeader.js
	SEARCHFORANYTHING:"Search for anything",
	ALLTASKANDSUPPORT:'All Tasks and Supports',
	INCOMETYPESETTING:'Income Type Settings',
	INCOMESTYPELIST:'Income Type List',
	NEWINCOME:'New Income Type',
	//ExpensesTypeManager.tsx
	CANTDELETE: "Unable to Delete or Edit",
	EXPENSESTYPELIST:"Expenses Type List",
	TYPESOFEXPENSES:"Types Of Expenses",
	EDIT:"Edit",
	AREYOUSURETODELETE:"Are You Sure You Want to Delete?",
	EXPENSEDELETE :"Expense Delete",
	DETAILPAGE:"Detail Page",
	MODULETYPESETTINGS:"Module Type Settings",
	//TaskReports
	NEWSTAFF:"New Staff",
	STAFF:"Staff",
	STAFFLIST:"Staff List",
	STAFFNAME:"Staff Member",
	DEPARTMENT:"Department",
	DETAIL:"Details",
	NUMBEROFTASKS:"Number of Tasks",
	COMPLETED:"Completed",
	BACKLOG:"Backlog",
	TASKMODULE:"Task Module",
	DATECREATED:"Date Created",
	DATECOMPLETED:"Date Completed",
	APPROVEDBY:"Approved By",
	DURATION:"Duration",
	TASKREPORTS:"Task Reports",
	FIRSTDATE:"First Date",
	LASTDATE:"Last Date",


	SAVEANDDONE:'Save and Done'
};

export default locale;
