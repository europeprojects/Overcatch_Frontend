import {MenuItem} from "@material-ui/core";
import React from "react";
import {User} from "firebase";

export interface UserDTO {
    id: number,
    password?: string,
    brpNumber?: string,
    brpExpireDate?: string,
    name?: string,
    payment?: String,
    surname?: string,
    email?: string,
    alternativeEmail?: string,
    msisdn?: string,
    alternativeMsisdn?: string,
    status?: number,
    photoURL?: string,
    photo?: Blob,
    userFolder?: string,
    userType?: UserType,
    roles: RoleDTO[],
    isPassChanged:Boolean,
    isDeleted:Boolean,
    isActive:Boolean,
    department:string,

    //Yeni Eklendi ...
    userlanguage?:string,

    chatList: ChatList[],
    createLetter: LetterType,
    companyForLetter: Company,

    // usersCompanyList: UserCompanyDTO[];   routingData?.userId.
}
export interface CustomerCreate {
    id: number;
    password: string;
    brpNumber: string;
    brpExpireDate: string;
    name: string;
    photoURL: string;
    photo: Blob;
    userFolder: string;
    payment: string;
    surname: string;
    notes: string;
    email: string;
    msisdn: string;
    status: number;
    userType?: UserType;
    roles: RoleDTO[];
    clientType: ClientTypeEnum;
    isExisting: boolean;
    visaType: string;
    agreementType: AgreementType;
    chatList: ChatList[];
}

export interface ChatList {
    id: number;
    chat: Chat[];
}

export interface Chat {
    id: number;
    name?: string;
    surname?: string;
    email?: string;
}

export interface RoleDTO {
    id: number;
    roleCode: string;
    roleDescription: string;
    moduleType: ModuleType;
}

export type AddressInfo = {
    id: number
    number: string
    city: string
    street: string
    county: string
    postcode: string
    relocationDate: string
    addressType: AddressType
    district: string
    country: string
}

export type AddressNewInfo = {
    id: number
    number: string
    city: string
    street: string
    county: string
    postcode: string
    relocationDate: string
    addressType: AddressType
    district: string
    country: string
    createdDateTime:string
}//AddressNewInfo Yeni Eklendi

export type FounderOwnerBusiness = {
    tradeAsName:string
    businessEmail:string
    phoneNumber:string
    eoriNumber:string
    vatNumber:string
    payeNumber:string
    gateway:string
}

export type FounderOwner = {
    id:number
    tradeAsName:string
    businessEmail:string
    phoneNumber:string
    eoriNumber:string
    payeNumber:string
    name:string
    surname:string
    email:string
    dob:string
    sex:string
    initial:string
    maritalStatus:string
    spouseName:string
    nextOfKinName:string
    nextOfKinAddress:string
    nextOfKinNumber:string
    nextOfKinEmail:string
    vatNumber:string
    gateway:string
    nino:string
    utr:string
    visaType:string
    residentailAddress: string
    businessAddress: string
    workStartDate: string
}

export type NatureBusiness = {
    id: number
    code: string
    description: string
}

export class Company {
    id: number;
    name: string;
    gateway:string;
    email: string;
    title: string;
    dueDate: string;
    registration: string;
    authentication: string;
    yearEndDate: string;
    quarterEndDate:string;
    confirmationStatementDate:string;
    payeNumber: string;
    paye: string;
    phoneNumber: string;
    eoriNumber: string;
    companyUtr: string;
    nationality: string;
    paOfficeNumber: string;
    companyNumber: string;
    vatNumber: string;
    incorporatedDate: string;
    directorDetails: DirectorDetail[];
    natureBusinesses: NatureBusiness[];
    nextStatementDate:string;
    statementDueDate:string;
    lastStatementDate:string;
    nextAccountsDate:string;
    accountsDueDate:string;
    lastAccountsDate:string;
    vatRegisterDate:string;
    vatPeriod:string;
}

export interface DocumentInfo {
    id: number;
    documentType: DocumentType;
    processID: number;
    userID: number;
    documentName: string;
    fileName: string;
    createDateTime:string;
    filePath: string;
    fileDescription: string;
    isActive: number;
    // company: CompanyInfo;
}

export interface DocumentUpload {
    description: String;
    file: File;
    documentType: String;
}

export interface FileUploadResult {
    processId: string
}

export class DynamicInformations {
    // heshe: string
    // HeShe: string
    // hisher: string
    // himher: string
    // himselfherself: string
    // invheshe: string
    // invhisher: string
    // invhimher: string
    // invitedName: string
    // invitedSurname: string
    // invitedDOB: string
    // invitedSex: string
    // relation: string
    // invitedAddress: string
    // initial: string
    // selectedUserHomeAddress: string
    // selectedUserBussAddress: string
    // selectedUserName: string
    // selectedUserSurname: string
    // selectedBussAddress: string
    // selectedBussName: string
    // selectedBussStartDate: string
    // selectedBussYearEndDate: string
    // opositeRelation: string
    // selectedUserDOB: string
    // selectedEmbassyAddress:string
    // selectedEmbassyName: string
    // date: string
    // selectedUserNINO: string
    // selectedUserUTR: string
    $longDate$: string
    $clientRef$: string
    $clientTitle$: string
    $clientFullName$: string
    $clientDob$: string
    $clientAddress$: string
    $clientSurname$: string
    $clientKnownAs$: string
    $clientCommencementDate$: string
    $herHim$: string
    $herHis$: string
    $HerHis$: string
    $sheHe$: string
    $SheHe$: string
    $herselfHimself$: string
    $companyRegisterAddress$: string
    $companyUTR$: string
    $clientNinoNumber$: string
    $yearEndDate$: string
    $clientLocation$: string // business trading gelecek
    $clientRegistrationNo$: string
    $findOutFromNatureOfbusiness$: string //Clienttaki Nature Business Info alanında gelecek
    $whereIsLocated$: string //Dolu ise trading address boş ise Home Addres

}

export class DynamicInformationsEntry{
    $nameOfBank$: string // Banka İsmi Dışarıdan girilecek
    $countryName$: string // dışarıdan girilecek
    $Address$: string // dışarıdan girilecek adres
    $natureofBusiness$: string // dışarıdan girilecek
    $taxYear$: string
    $HMRCRefNumberOnLetter$: string
    $penaltyAmount$: string
    $lettersDate$: string // dışarıdan mı belli bir gün mü ?
    $turnOver$: string
    $netProfitBeforeTax$: string
    $directorSalary$: string
    $divident$: string
    $netIncome$:string
    $interimAccountsTurnOver$: string
    $interimAccountsYearEndDate$: string
    $interimAccountsNetProfitBeforeTax$: string
    $interimAccountStartDate$: string
    $interimAccountEndDate$: string
}

export class DocumentClass implements DocumentInfo {
    id: number;
    documentName: string;
    fileDescription: string;
    fileName: string;
    filePath: string;
    createDateTime:string
    userID: number;
    processID: number;
    documentType: DocumentType;
    delete: string;
    isActive: number;
}

export class DirectorDetail2 {
    id: number;
    initial: string;
    name: string;
    surname: string;
    dob: string;
    sex: string;
    maritalStatus: string;
    spouseName: string;
    phoneNumber: string;
    nextOfKinName: string
    nextOfKinAddress: string
    nextOfKinNumber: string
    nextOfKinEmail: string
    residentailAddress: string
    businessAddress: string
    nino: string
    utr: string
    email: string
    visaType: string
    visaStartDate: string
    visaExpiryDate: string
}

export interface DirectorDetail {
    id: number;
    initial: string;
    name: string;
    surname: string;
    dob: string;
    sex: string;
    maritalStatus: string;
    spouseName: string;
    phoneNumber: string;
    nextOfKinName: string
    nextOfKinAddress: string
    nextOfKinNumber: string
    nextOfKinEmail: string
    residentailAddress: string
    businessAddress: string
    nino: string
    utr: string
    email: string
    visaType: string
    visaStartDate: string
    visaExpiryDate: string
    director:string
    owner:string
    taxReturn:string
}

export interface NatureBusinessCompany {
    nature: NatureBusiness;
    company: Company;
    id: number;
    isActive: boolean;
    lastUpdatedDateTime: string;
    createdDateTime: string;
}

export interface CustomerInfo {
    brpExpireDate: string;
    brpNumber: string;
    userInfo: UserDTO;
    // user:UserDTO;
    //
}

export interface CustomerClientDTO {
    id: number;
    customerInfo: CustomerInfo;
    sharePercent: number;
}


export type TaskConfirmation = {
    personel: any
    processDate: string
    taskConfirm: TaskConfirm
    tasks?: Task
    userRole: string;
    id: number
}

export type TaskDto = {
    id: number
    clientId: number
    moduleTypeEnum: string
    processDate: string
    userFullName: string
    customerFullName: string
    companyName?: string
    companyType: string
    confirmDate: string
    confirmType: string
    personelFullName: string
    agreementType:string
    personelId : string
}

export type Task = {
    id: number
    client: Client
    userInfo: UserDTO
    moduleType: ModuleType
    processDate: string
    isActive:number
    taskConfirmations?:TaskConfirmation[]
    userRole: string;
    //  department: string
}

export interface Client{
    id: number;
    vatNumber: string;
    notes: String;
    isExisting: Boolean;
    state: String;
    yearEndDate: string;
    customerClients: CustomerClientDTO[];
    addressList: AddressInfo[];
    // Yeni Eklendi : addressNewList
    addressNewList: AddressNewInfo[];

    founderOwner: FounderOwner;
    documents?: DocumentInfo[];
    directorDetails: DirectorDetail[];
    tasks: Task[];
    company: Company;
    payment: String;
    clientFolder:string;
    clientTypeEnum: ClientTypeEnum;
    agreementType: AgreementType;
    code: string;
    visaType: string;
    isActive: number
    taskConfirmations?: TaskConfirmation[]
    gateway:string;
    selectedInvoiceType : number;
    web:string;
    clientFileName:string,
    clientName:string;
    isVatMember:Boolean;
    status:Boolean;
    reminderDate:string;
    status_completed:Boolean;
}

export type CurrentUser = {
    userDisplayName: string
    storeDisplayName: string
    userType?: string
    company:Company;
}

export class ClientDTO {
    id: number;
    vatNumber: string;
    notes: String;
    isExisting: Boolean;
    state: String;
    yearEndDate: string;
    customerClients: CustomerClientDTO[];
    addressList: AddressInfo[];
    founderOwner: FounderOwner;
    documents?: DocumentInfo[];
    directorDetails: DirectorDetail[];
    tasks: Task[];
    company: Company;
    payment: String;
    clientFolder:string;
    clientTypeEnum: ClientTypeEnum;
    agreementType: AgreementType;
    code: number;
    visaType: string;
    gateway:string;
    selectedInvoiceType : number;
    web:string;
    clientFileName:string;
    clientName:string;
    isVatMember:Boolean;
}

export interface NewCustomerClientDTO {
    userId: number;
    notes: String;
    isExisting: Boolean;
    payment: String;
    clientTypeEnum: ClientTypeEnum
    agreementType: AgreementType
    isActive: Boolean;
    visaType: string
}

export interface AddressCreate {
    country1 : string
    district1: string
    number1: string
    city1: string
    street1: string
    county1: string
    postcode1: string
    addressType1: AddressType
    id: number
    country2 : string
    district2: string
    number2: string
    city2: string
    street2: string
    county2: string
    postcode2: string
    relocationDate: string
    addressType2: AddressType
    country3 : string
    district3: string
    number3: string
    city3: string
    street3: string
    county3: string
    postcode3: string
    addressType3: AddressType
}

export type VisaInvitedFormType = {
    invitedName: string;
    invitedSurname: string;
    invitedAddress: string;
    invitedDOB: string;
    invitedRelation: string;
    invitedSex: string;
}

export interface LetterType {
    letterTypeName: string;
    letterTemplate: string;
    id: number;
    clientType: string;
    userRole: string;
}
export interface ReminderType {
    reminderTypeName: string;
    reminderTemplate: string;
    reminderClientType:string,
    createdDateTime:any;
    isActive:number;
    id: number;
}
export interface Reminder {
    reminderFirstDate: string;
    reminderSecondDate: string;
    reminderThirdDate: string;
    reminderFourthDate: string;
    reminderResetDate:string;
    reminderType: ReminderType;
}
export interface Letter {
    client: Client;
    letterType: any;
    letter: string;
    id: number;
    userRole: string;
    document: DocumentClass
}

export interface Help {
    id: number,
    priorityLevel: string;
    answer: string;
    helpType: HelpType,
    client: Client,
    createdDateTime: string,
    taskConfirm: string,
    document: DocumentClass
    documentName: string;
    task: Task,
    file: File
    confirmType: string
    taskConfirmations:string;
    request_user : UserDTO;
    description: string,
    divided : number
}

export interface BankTransaction {
    id: number,
    startDate: string;
    endDate: string;
    accountName: string;
    iban: string;
    newBalance: string;
    previousBalance: string;
    sortCode: string;
    accountNumber: string;
    statementType:string;
    pdfName:string;
    bankType:string;
    clientType:string,
    totalMoneyIn:number;
    totalMoneyOut:number;
    client: Client,
    document: DocumentClass,
    task: Task,
    createdDateTime: string,
    businessName: string
}

export interface HelpType {
    helpTypeShowName:string;
    id: string,
    email:string,
    duration:number,
    divided: number
}
export interface ExpensesType {
    id: number,
    expensesType: string,
}
export interface IncomesType{
    id:number,
    incomesType:string,
}
export type Income = {
    id:number,
    clientId: number,
    price:number
    currencyOfPayment:string,
    incomeTypeId: number,
    incomeType:string,
    incomeDate: string,
    photo:Blob,
    is_active:boolean,
    fileName:string,
    filePath: string,
}
export class BankTransaction {
    client: Client;
    document: DocumentClass;
    transactionDetail: BankTransactionDetail;
    id: number;
    bankType: string;
    accountNumber: string;
    accountName: string;
}

export class BankTransactionDetail{
    id: number;
    processDate: string;
    description: string;
    moneyIn: string;
    moneyOut: string;
    balance: string;
    transactionType: string;
}

export type BuyerInfo= {
    id: number,
    clientId: number,
    buyerName: string,
    commercialTitle: string,
    buyerAddress: string,
    buyerEmail: string,
    buyerPhone: string,
    accountType: string,
    vatNumber:number,
    companyRegister: number,
}

export type InvoiceSettings = {
    logo: File,
    invoiceNumber: number,
    isInvoiceNumber: Boolean,
    clientId: number,
    photo: Blob,
    selectedInvoiceType:number,
    fileName:string,
    web:string,
    isMailSend:any,
    invoiceType:string,
}

export type ClientAccount ={
    id: number,
    bankName: string,
    sortCode: string,
    accountNumber: string,
    accountIBAN: string,
    clientId: number,
    web:string,
}

export type Invoice ={
    id: number,
    invoiceClientName: string,
    invoiceType: string,
    invoiceDate: string,
    vat: number,
    total: number,
    subTotal: number,
    commercialTitle: string,
    buyerName: string,
    buyerAddress: string,
    buyerPhone: string,
    buyerEmail: string,
    invoiceAddress: string,
    invoiceDetails: InvoiceDetail[],
    currencyOfPayment: string,
    clientAddress:string,
    invoiceCode: string,
    clientEmail: string,
    clientPhone: string,
    clientName: string,
    dueDate: string,
    updateState:number,
    deleteState:number,
    companyNumber: string,
    price:number,
    web : string,
    fileName:string,
    filePath:string,
    bank: ClientAccount,
    client: Client,
    selectedInvoiceType:number,
    invoiceNumber: number,
    pdf:any,
}

export class InvoiceDetail{
    id: number;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    vatAmount: number;
    amount: number;
    lastUpdatedDateTime:any;
    createdDateTime:any;
}

export type Currency ={
    code: string,
    countries: string[],
    currency: string,
    digits: number,
    number: string,
    // web:string,
}

enum PageStatus {
    CUSTOMER,
    EMPLOYEE,
    MANAGER,
}

enum SessionStatus {
    START,
    INPROGESS,
    DONE
}

export enum CompanyType {
    SOLETRADER,
    INCORPRATION
}

export enum AddressType {
    HOME,
    BUSINESS,
    OFFICE,
    TRADING,
}

export enum InvoiceType {
    INVOICE="Invoice",
    CREDITNOTE="Credit Note",
    PROFORMA="Proforma",
    DELIVERYNOTE="Delivery Note",
    SELFCERTIFICATE="Self Certificate",
}



enum ModuleType {
    COMPANY_CREATE,
    ADMIN,
    PAYROLL,
    VAT,
    COMPANYYEAREND,
    SOLETRADERACCOUNTS,
    SELFASSESMENT,
    VISAEXTENSION,
    MANAGER,
    LETTER_MODULE,
    BANK_STATEMENT_CONVERSION,
    INVOICE_MODULE,
    CUSTOMER_ORDER_MODULE,
    VISA_DOCUMENT_MODULE,
    PAYROL_MODULE,
    HELP_MODULE}

export enum UserType {
    CUSTOMER,
    EMPLOYEE,
    MANAGER
}

export enum DocumentType {
    BANK,
    VISA,
    LETTER,
    UTR,
    NINO,
    PAYE,
    COMPANY,
    BRPCARD,
    OTHER,
    PASSPORT,
    TC,
    POLICEREGISTRATION,
    AUTHENTICATION,
    PERSONALUTR,
    COMPANYUTR,
    CERTIFICATE,
    SHARECERTS,
    MERMARTS,
    VATCERTIFICATE,
    BRPFRONT,
    BRPBACK,
    DRIVINGLICENCE,
    UTILITYBILL,
    HELP,
    COMPANYAUTHENTICATIONCODE,
    VATACKNOWLEDGEMENT,
    EXPENSE,
    LASTYEARENDACCOUNTS,
    TAXRETURN,
    DIRIVINGLICENCE,
}

export enum TaskConfirm {
    INPROGRESS,
    DONE,
    REJECTED,
}

export enum ClientTypeEnum {
    SOLETRADE,
    LIMITED,
    SELFASSESMENT
}

export enum AgreementType {
    TRADING,
    ECAA,
    OTHER
}

export enum BankType {
    TURKISH="Turkish",
    HSBC="Hsbc",
    TIDE="Tide",
    STARLING="Starling",
    NATWEST="Natwest",
    MONZO="Monzo",
    METRO="Metro",
    LLOYDS="Lloyds",
    BARCLAYS="Barclays",
    MONESE="Monese"
}

export class NoticeLogDTO {
    id: number;
    ECAA: boolean;
    app: boolean;
    limited: boolean;
    mail: boolean;
    other: boolean;
    selfAssesment: boolean;
    sms: boolean;
    soleTrade: boolean;
    trading: boolean;
    vat: boolean;
    // company: CompanyInfo;
    subject: string;
    content: string;
    clientList: ClientDTO[];
}
export interface NoticeLog{
    id: number;
    notiType: String;
    notiTo: String;
    subject: String;
    message: String;
    status: number;
    user: User;
    client: Client;
}

export type CashInvoice = {
    id:number,
    clientId: number,
    cashPrice:number
    cashCurrencyOfPayment:string,
    cashInvoiceTypeId: number,
    cashInvoiceType:string,
    cashInvoiceDate: string,
    photo:Blob,
    is_active:boolean,
    fileName:string,
    filePath: string,
}

export enum CashInvoiceType{
    KIRTASIYE="Kırtasiye",
    TEST1="Test1",
    TEST2="Test2",
}

export type CashCurrency ={
    code: string,
    currency: string,
    digits: number,
    number: string
}

export class ForFilter{
    buyerName:string;
    invoiceType:string;
    invoiceDate:string;
    invoiceEndDate:string;
    client_id:number;
    page:number;
    size:number;
    search:string;
    currency: string;
}

export type NotificationLogFilter={
    notificationType:string,
    search:string,
    startDate:string,
    endDate:string,
    page:number,
    size:number,
}

export class ForFilterExpenses{
    invoiceCurrency:string;
    invoiceType:string;
    invoiceDate:string;
    invoiceEndDate:string;
    clientId:string;
    page:number;
    size:number;
    search:string;
    //type:string;
}
export class ForFilterIncomes{
    currency:string;
    incomeType:string;
    incomeDate:string;
    incomeEndDate:string;
    clientId:string;
    page:number;
    size:number;
    search:string;
    //type:string;
}

export class NotificationCreateDTO {
    noticeLogDTO:NoticeLogDTO;
    clientList:ClientDTO[];
}

export class ForFilterExpensesExcel{
    invoiceCurrency:string;
    invoiceType:string;
    invoiceDate:string;
    invoiceEndDate:string;
    clientId:string;
    search:string;
}

export class ForFilterIncomeExcel{
    currency:string;
    incomeType:string;
    incomeDate:string;
    incomeEndDate:string;
    clientId:string;
    search:string;
}

export class ForFilterDateInEx{
    id:number;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
    clientId:number;
    type:string;
    expenseTypes:string;
    invoiceTypes:string;
}

export type ModuleTypeDTO={
    id:Long,
    name:String,
    moduleTypeEnum:String,
    moduleType:ModuleType,
    responsibleEmail:String,
    moduleTypeId:number,
}
export class BankMasterDTO{
    id:any;
    name:string;
}
export class PersonelDTO{
    user:string;
    personel:string;
}

export class Divided{
    id:number;
    paymentNumber:number;
    datePaymentRate: string;
    shareHolding:number;
    amountPayable:number;
    currency:string;
    directorId:number;
    dividedEndDate:string;
}