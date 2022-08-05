import * as yup from 'yup';
import i18n from 'i18next';
import tr from './validations-i18n/tr';
import en from './validations-i18n/en';

const phoneRegExp =
	/([+]|[0]{2})[\s]?(([(]?[0-9]{1,4}[)]?))[-\s\.]?[(]?[0-9]{1,4}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
const accountNumberRegex = /^[0-9]{8,8}$/;
const sortCodeRegex = /^[0-9]{6,6}$/;
const ibanRegex = /^GB\d{2}[A-Z]{4}\d{14}$/;
const eoriRegex = /(GB)[0-9]{12,12}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const authRegex = /[0-9,A-Z]{2,2}[0-9]{6,6}$/;
const payeRegex = /[0-9]{3,3}\/[A-Z]{1,2}[0-9]{5,5}$/;
const payeOfficeRegex = /[0-9]{3,3}\/[A-Z]{2,2}[0-9]{8,8}$/;
const vatRegex = /(GB)[0-9]{9,9}$/;
const utrRegex = /[0-9]{10,10}$/;
const regisRegex = /[0-9,A-Z]{8,10}$/;
const gatewayRegex = /[0-9]{12,12}$/;
const ninoRegex = /^[A-Z]\d{2}[0-9]{6,6}[A-D]\d{1}$/;

function translate(key) {
	var currentLanguage = i18n.language;
	if (currentLanguage == 'en') {
		return en[key];
	} else return tr[key];
}

export const newEmployeeValidations = yup.object({
	email: yup.string().email(translate('VALIDMAIL')).required(translate('EMAILREQUIRED')),
	name: yup.string().min(2, translate('MINLENGTHOFNAME')).required(translate('NAMEREQUIRED')),
	surname: yup.string().min(2, translate('MINLENGTHOFSURNAME')).required(translate('SURNAMEREQUIRED')),
	msisdn: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	userType: yup.string().oneOf(['EMPLOYEE', 'MANAGER', 'CLIENT']).required(translate('PLEASESELECTTYPE')),
	department:yup.string()
});

export const customerFormValidationSchema = yup.object({
	email: yup.string().email(translate('VALIDMAIL')).required(translate('EMAILREQUIRED')),
	name: yup
		.string()
		.min(2, translate('MINLENGTHOFNAME'))
		.max(25, translate('MAXLENGTHOFNAME'))
		.required(translate('NAMEREQUIRED')),
	surname: yup
		.string()
		.min(2, translate('MINLENGTHOFSURNAME'))
		.max(25, translate('MAXLENGTHOFSURNAME'))
		.required(translate('SURNAMEREQUIRED')),
	msisdn: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	payment: yup
		.number()
		.test('Is positive?', translate('ERRORNUMBERMUSTPOSITIVE'), value => value > 0)
		.required(translate('ENTERAGREEDPRICE')),
	clientType: yup.string().oneOf(['SOLETRADE', 'LIMITED', 'SELFASSESMENT']).required(translate('PLEASESELECTTYPE')),
	isExisting: yup.string().oneOf(['false', 'true']).required(translate('PLEASESELECTTYPE')),
	notes: yup.string().max(500, translate('MAXLENGTHOFNOTES'))
});

export const buyerValidationScheme = yup.object({
	buyerName: yup.string().min(4, translate('MINLENGTHOFBUYERNAME')).required(translate('BUYERNAMEREQUIRED')),
	buyerAddress: yup.string().min(10, translate('MINLENGTHOFADDRESS')).required(translate('ADDRESSREQUIRED')),
	buyerPhone: yup
		.string()
		.matches(phoneRegExp,translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	accountType: yup.string().oneOf(['COMPANY', 'SOLETRADER', 'INDIVIDUAL']).required(translate('PLEASESELECTTYPE')),
	buyerEmail: yup.string().email(translate('EMAILNOTVALID')).nullable(),
	vatNumber: yup.number().nullable(),
	companyRegister: yup.number().nullable()
});

export const supportSettingsScheme = yup.object({
	helpTypeShowName: yup.string().required('Please enter topic of request'),
	email: yup.string().email(translate('EMAILNOTVALID')).nullable(),
	duration: yup
		.number()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0)
		.required('Please enter agreed price')
});

export const notificationCreateSettingsScheme = yup.object({
	subject: yup.string().required(translate('NOTIFICATIONSUBJECT')),
	content: yup.string().required(translate('NOTIFICATIONCONTENT'))
});

export const reminderCreateSettingsScheme = yup.object({
	subject: yup.string().required(translate('REMINDERSUBJECT')),
	content: yup.string().required(translate('REMINDERCONTENT'))
});

export const exportSettingsScheme = yup.object({
	expensesType: yup.string().required('Please enter type of expenses')
});

export const incomeScheme = yup.object({
	incomesType: yup.string().required('Please enter type of incomes')
});

export const bankMasterScheme = yup.object({
    name: yup
        .string()
        .required("Please enter type of expenses"),
});
export const clientAccountScheme = yup.object({
	bankName: yup.string().min(4, translate('MINLENGTHOFBANK')).required(translate('BANKNAMEREQUIRED')),
	sortCode: yup
		.string()
		.matches(sortCodeRegex, translate('SORTCODENOTVALID'))
		.required(translate('SORTCODEREQUIRED')),
	accountNumber: yup
		.string()
		.matches(accountNumberRegex, translate('ACCOUNTNUMBERNOTVALID'))
		.required(translate('ACCOUNTNUMBERREQUIRED')),
	accountIBAN: yup.string().matches(ibanRegex, translate('IBANNUMBERNOTVALID')).nullable()
});

export const contactListScheme = yup.object({
	clientTypeEnum: yup
		.string()
		.oneOf(['SOLETRADE', 'LIMITED', 'SELFASSESMENT'])
		.required(translate('PLEASESELECTCLIENTTYPE')),
	agreementType: yup.string().oneOf(['TRADING', 'ECAA', 'OTHER']),
	isExisting: yup.string().oneOf(['false', 'true']).required(translate('PLEASESELECTTYPE')),
	notes: yup.string().max(250, translate('MAXLENGTHOFCONSIDER')),
	payment: yup.number().min(100, translate('MINAGREEDPRICE')).required(translate('AGREEDPRICEREQUIRED')),
	visaType: yup.string().nullable()
});

export const limitedBusinessScheme = yup.object({
	name: yup.string().min(4, translate('MINLENGTHOFCOMPANY')).required(translate('WRITECOMPANYNAME')),
	email: yup.string().matches(emailRegex, translate('EMAILNOTVALID')).required(translate('VALIDMAIL')),
	phoneNumber: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	eoriNumber: yup.string().matches(eoriRegex, translate('EORINUMBERNOTVALID')).nullable(),
	payeNumber: yup.string().matches(payeRegex, translate('PAYENUMBERNOTVALID')).nullable(),
	paOfficeNumber: yup.string().matches(payeOfficeRegex, translate('PAYEACCOUNTSOFFICENUMBERNOTVALID')).nullable(),
	vatNumber: yup.string().matches(vatRegex, translate('VATNUMBERNOTVALID')).nullable(),
	companyUtr: yup
		.string()
		.matches(utrRegex, translate('UTRNUMBERNOTVALID'))
		.max(10, translate('UTRNUMBERNOTVALID'))
		.nullable(),
	companyNumber:yup.string().required(translate('WRITECOMPANYNUMBER')),
	registration: yup
		.string()
		.matches(regisRegex, translate('REGISTRATIONNUMBERNOTVALID'))
		.max(10, translate('REGISTRATIONNUMBERNOTVALID'))
		.min(8, translate('REGISTRATIONNUMBERNOTVALID'))
		.nullable(),
	authentication: yup
		.string()
		.min(6, translate('AUTHENTICATIONNUMBERNOTVALID'))
		.max(8, translate('AUTHENTICATIONNUMBERNOTVALID'))
		.nullable(),
	nationality: yup.string().nullable(),
	gateway: yup.string().matches(gatewayRegex, translate('GATEWAYID')).max(12, translate('GATEWAYID')).nullable(),
	yearenddate: yup.date().required(translate('YEARENDDATE')),
	quarterend: yup.date().nullable(),
	confirmationstatement: yup.date().required(translate('CONFIRMATIONSTATEMENT'))
});

export const moduleTypeManager = yup.object({
	responsibleEmail: yup.string().matches(emailRegex, translate('EMAILNOTVALID')).required(translate('VALIDMAIL'))
});

export const founderOwnerScheme = yup.object({
	tradeAsName: yup.string().min(2, translate('MINLENGTHOFTRADA')).required(translate('TRADANAMEREQUIRED')),
	businessEmail: yup.string().matches(emailRegex, translate('EMAILNOTVALID')).required(translate('BUSINESSMAIL')),
	phoneNumber: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	vatNumber: yup.string().matches(vatRegex, translate('VATNUMBERNOTVALID')).nullable(),
	eoriNumber: yup.string().matches(eoriRegex, translate('EORINUMBERNOTVALID')).nullable(),
	payeNumber: yup.string().matches(payeRegex, translate('PAYENUMBERNOTVALID')).nullable(),
	gateway: yup.string().matches(gatewayRegex, translate('GATEWAYID')).max(12, translate('GATEWAYID')).nullable()
});

export const directorDetailSheme = yup.object({
	name: yup
		.string()
		.min(2, translate('MINLENGTHOFNAME'))
		.max(25, translate('MAXLENGTHOFNAME'))
		.required(translate('NAMEREQUIRED')),
	surname: yup
		.string()
		.min(2, translate('MINLENGTHOFSURNAME'))
		.max(25, translate('MAXLENGTHOFSURNAME'))
		.required(translate('SURNAMEREQUIRED')),
	email: yup.string().email(translate('EMAILNOTVALID')).required(translate('VALIDMAIL')),
	phoneNumber: yup.string().matches(phoneRegExp, translate("PHONEISNOTVALID")).nullable(),
	dob: yup.date().required(translate('BIRTHDAYNOTVALID')),
	workStartDate: yup.date().nullable(),
	sex: yup.string().oneOf(['true', 'false']).nullable(),
	nino: yup.string().nullable(),
	utr: yup.string().matches(utrRegex, translate('UTRNUMBERNOTVALID')).nullable(),
	maritalStatus: yup.string().oneOf(['true', 'false']).nullable(),
	visaType: yup.string().max(50, translate('MAXLENGTHOFVISATYPE')).nullable(),
	// spouseName : yup
	//     .string()
	//     .max(25, 'Name should be of maximum 25 characters length')
	//     .required('Surname is required'),
	nextOfKinName: yup
		.string()
		.min(2, translate('MINLENGTHOFNAME'))
		.max(25, translate('MAXLENGTHOFNAME'))
		.required(translate('NAMEREQUIRED')),
	nextOfKinNumber: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	nextOfKinEmail: yup.string().email(translate('EMAILNOTVALID')).required(translate('EMAILREQUIRED')),
	nextOfKinAddress: yup.string().max(150, translate('MAXLENGTHOFADDRESS')).required(translate('EMAILREQUIRED'))
});

export const directorDetailSheme1 = yup.object({
	name: yup
		.string()
		.min(2, translate('MINLENGTHOFNAME'))
		.max(25, translate('MAXLENGTHOFNAME'))
		.required(translate('NAMEREQUIRED')),
	surname: yup
		.string()
		.min(2, translate('MINLENGTHOFSURNAME'))
		.max(25, translate('MAXLENGTHOFSURNAME'))
		.required(translate('SURNAMEREQUIRED')),
	email: yup.string().email(translate('EMAILNOTVALID')).required(translate('VALIDMAIL')),
	phoneNumber: yup.string().matches(phoneRegExp, translate("PHONEISNOTVALID")).nullable(),
	dob: yup.date().required(translate('BIRTHDAYNOTVALID')),
	sex: yup.string().oneOf(['true', 'false']).nullable(),
	nino: yup.string().nullable(),
	utr: yup.string().matches(utrRegex, translate('UTRNUMBERNOTVALID')).nullable(),
	maritalStatus: yup.string().oneOf(['true', 'false']).nullable(),
	visaType: yup.string().max(50, translate('MAXLENGTHOFVISATYPE')).nullable(),
	nextOfKinName: yup
		.string()
		.min(2, translate('MINLENGTHOFNAME'))
		.max(25, translate('MAXLENGTHOFNAME'))
		.required(translate('NAMEREQUIRED')),
	nextOfKinNumber: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	nextOfKinEmail: yup.string().email(translate('EMAILNOTVALID')).required(translate('VALIDMAIL')),
	nextOfKinAddress: yup.string().max(150, translate('MAXLENGTHOFADDRESS')).required(translate('ADDRESSREQUIRED'))
});

export const homeAdresFormSheme = yup.object({
	country1: yup.string().required('Please enter country code'),
	district1: yup.string().required('Please enter district code'),
	number1: yup.string().required('Please enter number code'),
	street1: yup.string().required('Please enter street code'),
	county1: yup.string(),
	city1: yup.string().required('Please enter city code'),
	postcode1: yup.string().required('Please enter postcode code'),
	country2: yup.string(),
	district2: yup.string(),
	number2: yup.string(),
	street2: yup.string(),
	county2: yup.string(),
	city2: yup.string(),
	postcode2: yup.string(),
	country3: yup.string().required('Please enter country code'),
	district3: yup.string().required('Please enter district code'),
	number3: yup.string().required('Please enter number code'),
	street3: yup.string().required('Please enter street code'),
	county3: yup.string(),
	city3: yup.string().required('Please enter city code'),
	postcode3: yup.string().required('Please enter postcode code')
});

export const supportPageSheme = yup.object({
	priorityLevel: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required('Please choose one of the options'),

	helpType: yup.object().required('Please choose one of the options'),

	description: yup.string().required('Please enter the content of the email to be sent'),

	divided : yup.object().nullable()
});
export const dividedPageSheme = yup.object({
	paymentNumber: yup.number()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0)
		.required('please enter a correct value'),
	datePaymentRate: yup.date()
		.required('please enter a correct value'),
	amountPPayable: yup.number()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0)
		.required('please enter a correct value'),
	shareHolding: yup.number()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0)
		.required('please enter a correct value')
});

export const documentFormSheme = yup.object({
	description: yup.string().max(50, translate('MAXLENGTHOFDESCRIPTION')).required()
});
export const userUpdateFormSheme = yup.object({
	name: yup.string().min(2, translate('MINLENGTHOFNAME')).required(translate('NAMEREQUIRED')),
	surname: yup.string().min(2, translate('MINLENGTHOFSURNAME')).required(translate('SURNAMEREQUIRED')),
	email: yup.string().matches(emailRegex, translate('EMAILNOTVALID')).required(translate('VALIDMAIL')),
	alternativeEmail: yup.string().matches(emailRegex, translate('EMAILNOTVALID')).nullable(),
	msisdn: yup
		.string()
		.matches(phoneRegExp, translate("PHONEISNOTVALID"))
		.required(translate('PHONENUMBERREQUIRED')),
	alternativeMsisdn: yup.string().matches(phoneRegExp, translate("PHONEISNOTVALID")).nullable()
});
