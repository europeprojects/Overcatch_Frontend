import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/login/LoginConfig';
import UserCreateConfig from 'app/main/user/UserCreateConfig';
import UsersConfig from 'app/main/user/UsersConfig';
import TasksConfig from '../main/task/TasksConfig';
import DocumentCreateConfig from '../main/document/DocumentCreateConfig';
import ProfilePageConfig from '../main/profile/ProfilePageConfig';
import ProfileImagesConfig from '../main/profile/ProfileImagesConfig';
import Dashboard1Config from '../main/dashboard/Dashboard1Config';
import Dashboard2Config from '../main/dashboard/Dashboard2Config';
import Dashboard3Config from '../main/dashboard/Dashboard3Config';
import CompanyListConfig from '../main/company/companies/CompanyListConfig';
import MainPageConfig from '../main/main/MainPageConfig';
import CompanyApplicationsConfig from '../main/company/companyApplications/CompanyApplicationsConfig';
import ApplicationConfig from '../main/clientApplication/ApplicationConfig';
import LetterCustomerConfig from '../main/letter/pages/LetterCustomerConfig';
import LetterEmployeeConfig from '../main/letter/pages/LetterEmployeeConfig';
import LetterTemplatesConfig from '../main/letter/pages/LetterTemplatesConfig';
import CreateLetterTemplateConfig from '../main/letter/pages/CreateLetterTemplateConfig';
import TaskHomeConfig from '../main/task/tasks/TaskHomeConfig';
import PasswordChangeConfig from '../main/PasswordChange/PasswordChangeConfig';
import SupportPageConfig from '../main/support/SupportPageConfig';
import SupportListConfig from '../main/support/SupportListConfig';
import SupportTaskConfig from '../main/task/components/SupportTaskConfig';
import ClientTasksConfig from '../main/task/ClientTasksConfig';
import ClientLettersConfig from '../main/letter/pages/ClientLettersConfig';
import ConversionConfig from '../main/conversion/ConversionConfig';
import BankTransactionConfig from '../main/transactions/BankTransactionConfig';
import BuyerListConfig from '../main/invoice/BuyerListConfig';
import InvoiceCreateConfig from '../main/invoice/InvoiceCreateConfig';
import InvoiceSettingsConfig from '../main/invoice/InvoiceSettingsConfig';
import InvoiceListConfig from '../main/invoice/InvoiceListConfig';
import InvoiceUpdateConfig from '../main/invoice/InvoiceUpdateConfig';
import InvoicePrintConfig from '../main/invoice/InvoicePrintConfig';
import Error404PageConfig from '../main/error/Error404PageConfig';
import ForgotPasswordPage from '../main/ResetPassword/ForgotPasswordPage';
import InvoicestaticConfig from '../main/invoice/Examples/InvoicestaticConfig';
import InvoicesConfig from '../main/invoice/InvoicesConfig';
import notificationConfig from '../main/reminder/notificationConfig';
import notifCreateConfig from '../main/reminder/notifCreateConfig';
import MyClientConfig from '../main/company/companies/MyClientConfig';
import CashInvoiceConfig from '../main/invoice/CashInvoiceConfig';
import ReminderTemplateConfig from '../main/reminder/ReminderTemplateConfig';
import CreateLetterCustomerConfig from '../main/letter/pages/CreateLetterCustomerConfig';
import MyClientsListConfig from '../main/company/companies/MyClientsListConfig';
import CustomSentLettersConfig from '../main/letter/pages/CustomSentLettersConfig';
import MyIncomeExpenseConfig from '../main/incomeExpense/MyIncomeExpenseConfig';
import SupportSettingsConfig from '../main/support/SupportSettingsConfig';
import ExpensesTypeManagerConfig from '../main/invoice/ExpensesTypeManagerConfig';
import ClientsIncomeExpenseConfig from '../main/incomeExpense/ClientsIncomeExpenseConfig';
import ModuleTypeManagerConfig from '../main/moduleType/ModuleTypeManagerConfig';
import BankMasterConfig from "../main/invoice/BankMasterConfig";
import InvoiceCopyConfig from "../main/invoice/InvoiceCopyConfig";
import TaskReportsMainConfig from "../main/tasksReports/TaskReportsMainConfig";
import CashSaveConfig from "../main/invoice/CashSaveConfig";
import ReminderListConfig from "../main/reminder/ReminderConfig";
import IncomeConfig from "../main/invoice/IncomeConfig";
import IncomeTypeManagerConfig from "../main/incomeExpense/IncomeTypeManagerConfig";
import IncomeSaveConfig from "../main/invoice/IncomeSaveConfig";
import CreateDividedCustomerConfig from "../main/support/CreateDividedCustomerConfig";
import CreatedDividedConfig from "../main/support/CreatedDividedConfig";
//import DividedConfig from "../main/dividedVoucher/DividedConfig";
const routeConfigs = [
	LoginConfig,
	UserCreateConfig,
	UsersConfig,
	TasksConfig,
	DocumentCreateConfig,
	Dashboard1Config,
	ReminderTemplateConfig,
	CreateLetterCustomerConfig,
	MyClientsListConfig,
	MyIncomeExpenseConfig,
	ClientsIncomeExpenseConfig,
	ExpensesTypeManagerConfig,
	ProfilePageConfig,
	ProfileImagesConfig,
	Dashboard2Config,
	Dashboard3Config,
	CompanyListConfig,
	MainPageConfig,
	ApplicationConfig,
	CompanyApplicationsConfig,
	LetterEmployeeConfig,
	LetterCustomerConfig,
	TaskHomeConfig,
	PasswordChangeConfig,
	SupportPageConfig,
	SupportListConfig,
	SupportTaskConfig,
	ClientTasksConfig,
	ClientLettersConfig,
	ConversionConfig,
	BankTransactionConfig,
	BuyerListConfig,
	InvoiceCreateConfig,
	InvoiceSettingsConfig,
	InvoicesConfig,
	notifCreateConfig,
	InvoicestaticConfig,
	InvoiceListConfig,
	InvoicePrintConfig,
	Error404PageConfig,
	LetterTemplatesConfig,
	CreateLetterTemplateConfig,
	CustomSentLettersConfig,
	ForgotPasswordPage,
	InvoiceUpdateConfig,
	notificationConfig,
	InvoicesConfig,
	CashInvoiceConfig,
	MyClientConfig,
	SupportSettingsConfig,
	ModuleTypeManagerConfig,
	BankMasterConfig,
	InvoiceCopyConfig,
	TaskReportsMainConfig,
	CashSaveConfig,
	ReminderListConfig,
	IncomeConfig,
	IncomeTypeManagerConfig,
	IncomeSaveConfig,
	CreateDividedCustomerConfig,
	CreatedDividedConfig,
];


const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['manager', 'employee', 'customer']),
	{
		path: '/',
		component: () => <Redirect to="/main" />
	}
];

export default routes;
