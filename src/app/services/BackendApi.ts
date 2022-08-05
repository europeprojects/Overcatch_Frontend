import {
    FileUploadResult,
    NatureBusiness,
    Task,
    UserDTO,
    TaskDto,
    DocumentClass,
    CustomerCreate,
    Client,
    Letter,
    LetterType,
    NewCustomerClientDTO,
    Help,
    HelpType,
    BankTransaction,
    BankTransactionDetail,
    BuyerInfo,
    ClientAccount,
    InvoiceSettings,
    Invoice,
    NoticeLogDTO,
    ReminderType,
    Reminder,
    CashInvoice,
    ForFilter,
    ForFilterExpenses,
    ForFilterDateInEx,
    ExpensesType,
    NotificationLogFilter,
    BankMasterDTO,
    ForFilterExpensesExcel,
    DirectorDetail,
    Divided,
    IncomesType,
    Income,
    ForFilterIncomes,
    ForFilterIncomeExcel, AddressNewInfo,
} from "app/types/UserModel";
import {blobToFile} from "app/utils/utils";
import {createApi} from "../components/ApiClient";
import config from "./Config";
import {ModuleTypeDTO} from "../types/UserModel";

export default class api {
    static getProfilIxmage(photoURL: any) {
        throw new Error('Method not implemented.');
    }

    static api = createApi(config.BACKEND_API_URL);

    static getHata(): Promise<String> {
        return this.api.get('/api/doc/hata').then(res => res.data)
    }

    static userSignin(email1: string, password1: string) {
        return this.api.post('/auth/signin', {email1, password1}).then(res => res.data)
    }

    static createDocument(request: Client) {
        return this.api.post('/api/document', request).then(res => res.data)

    }

    static addClient(request: NewCustomerClientDTO) {
        return this.api.post('/api/client/addclient', request).then(res => res.data)

    }

    static getApplyCompanies() {
        return this.api.get('/api/client/apply').then(res => res.data)
    }

    static getApplyCompaniesByFilter(aggrementType: string, clientType: string, exist: string, state: string, search: string) {
        return this.api.get('/api/client/applyByMultiFilter?' +
            'aggrementType=' + aggrementType +
            '&clientType=' + clientType +
            '&exist=' + exist +
            '&state=' + state +
            '&search=' + search)
            .then(res => res.data)
    }
    static getNotifiticationsByFilter(notificationType: string, clientType: string, search: string) {
        return this.api.get('/api/notice/applyByFilter?' +
            'notificationType=' + notificationType +
            '&clientType=' + clientType +
            '&search=' + search)
            .then(res => res.data)
    }

    static getTaskConfirm(taskConfirmType: string, taskId: number, message: string) {
        return this.api.post('/api/taskconfirm/change', {taskId, taskConfirmType, message}).then(res => res.data)
    }

    static getDirectorDetail(directorId :string){
        return this.api.post('/api/company/findById?directorId='+ directorId).then(res => res.data);
    }
    static createCompany(request: Client) {
        return this.api.post('/api/client/create', request).then(res => res.data)
    }

    static updateCompany(request: Client) {
        return this.api.post('/api/client/update', request).then(res => res.data)
    }

    static getCurrentUser(): Promise<UserDTO> {
        return this.api.get('/api/user/getcurrentuser').then(res=> res.data)
    }

    static getDownloadDocument(fileName: string) {
        const configg = {
            responseType: 'blob'
        }
        // @ts-ignore
        return this.api.get('/api/file/downloadFile/' + fileName, configg).then(res =>
            res.data
        )
    }
    // Büşra Budan
    static fileDownload(fileName : string){
        // const configg = {
        //     responseType: 'blob'
        // }
        return this.api.get('/api/divided/file/'+ fileName, {responseType: 'blob'}).then(res => 
            res.data
        )
    }

    static getDownloadDocumentByUser(clientId: string, fileName: string) {
        const configg = {
            responseType: 'blob'
        }
        // @ts-ignore
        return this.api.get('/api/file/downloadFile/' + clientId + '/' + fileName, {responseType: 'blob'}).then(res =>
            res.data
        )
    }

    static getDocumentForClient(clientId: string, fileName: string) {
        const configg = {
            responseType: 'blob'
        }
        // @ts-ignore
        return this.api.get('/api/file/downloadFile/' + clientId + '/' + fileName, {responseType: 'blob'});
    }

    static saveBankTransaction(request: BankTransaction) {
        return this.api.post('/api/company/banktransaction', request).then(res => res.data)
    }

    static saveBankTransactionDetail(request: BankTransactionDetail) {
        return this.api.post('/api/company/transactiondetail', request).then(res => res.data)
    }

    static getBankTransactions(clientId: string) {
        return this.api.get('/api/company/getbanktransactions?clientId=' + clientId).then(res => res.data)
    }


    static getBankTransactionDetails(transactionId: string) {
        return this.api.get('/api/company/gettransactiondetailbyid?transactionId=' + transactionId).then(res => res.data)
    }

    static getDownloadStatement(fileName: string) {
        const configg = {
            responseType: 'blob'
        }
        // @ts-ignore
        return this.api.get('/api/file/downloadStatement/' + fileName, {responseType: 'blob'}).then(res =>
            res.data
        )
    }

    static getProfilImage(fileName: string) {
        return this.getDownloadDocument(fileName).then(data => {
            //return window.URL.createObjectURL(new Blob([data]));
            return blobToFile(data, fileName);
        });
    }

    static getProfilImageByUser(userFolder: string, fileName: string) {

        return this.getDownloadDocumentByUser(userFolder, fileName).then(data => {
            return blobToFile(data, fileName);
        });
    }

    static getDocuments(id: number) {
        return this.api.get('/api/document/documents?clientId=' + id).then(res => res.data)
    }

    static getNatureBusiness(): Promise<NatureBusiness[]> {
        return this.api.get('/api/company/naturebusiness').then(res => res.data)
    }

    static getCompanies(page: number, size: number) {
        return this.api.get('/api/client/companies?page=' + page + '&size=' + size).then(res => res.data)
    }

    static getCompaniesByFilter(agg, clientType, search, page, size) {
        return this.api.get('/api/client/filter?agg=' + agg + "&clientType=" + clientType + "&search=" + search +
            "&page=" + page + "&size=" + size).then(res => res.data)
    }

    static getInvoicesByFilter(forFilter: ForFilter) {
        return this.api.post('/api/invoice/filter', forFilter).then(res => res.data)
    }

    static getCashInvoicesByFilter(forFilter: ForFilterExpenses) {
        return this.api.post('/api/cashInvoice/filter', forFilter).then(res => res.data)
    }

    static getIncomesByFilter(forFilter: ForFilterIncomes) {
        console.log(forFilter," backend giden")
        return this.api.post('/api/income/filter', forFilter).then(res => res.data)
    }

    static getAllForExcelByClientId(forFilterExcell : ForFilterExpensesExcel){
        return this.api.post('/api/cashInvoice/getAllForExcelByClientId', forFilterExcell).then(res => res.data)
    }
    static getAllIncomeForExcelByClientId(forFilterExcell : ForFilterIncomeExcel){
        return this.api.post('/api/cashInvoice/getAllForExcelByClientId', forFilterExcell).then(res => res.data)
    }
    static getIncomeExpenseList(clientId: number) {
        return this.api.post('/api/incomeExpense/getListIncomeExpense?clientId=' + clientId).then(res => res.data)
    }
    static getInvoiceForIncomeExpenseListFilter(clientId:number){
        return this.api.post('/api/incomeExpense/getInvoiceForIncomeExpenseListFilter?clientId='+ clientId).then(res=>res.data)
    }
    static getExpensesForIncomeExpenseListFilter (clientId : number){
        return this.api.post('/api/incomeExpense/getExpensesForIncomeExpenseListFilter?clientId='+clientId).then(res=>res.data)
    }
    static getBankForIncomeExpenseListFilter (clientId : number){
        return this.api.post('/api/incomeExpense/getBankForIncomeExpenseListFilter?clientId='+clientId).then(res=>res.data)
    }
    static getIncomeExpenseByFilter(forFilter : ForFilterDateInEx) {
        return this.api.post('/api/incomeExpense/filter', forFilter).then(res => res.data)
    }

    static getTaskList(moduleType): Promise<TaskDto[]> {
        return this.api.get('/api/task/confirm?moduleType=' + moduleType).then(res => res.data)
    }

    static getTaskModuleList(moduleType, moduleTypeClick: string, confirmTypeClick: string): Promise<TaskDto[]> {
        return this.api.get('/api/task/getTaskModuleList?moduleType=' + moduleType + '&moduleTypeClick=' + moduleTypeClick + '&confirmTypeClick=' + confirmTypeClick).then(res => res.data)
    }


    static getTaskModuleType(moduleType): Promise<TaskDto[]> {
        return this.api.get('/api/task/getTask?moduleType=' + moduleType).then(res => res.data)
    }

    static getTaskModuleTypeAdminSupport(moduleType): Promise<TaskDto[]> {
        return this.api.get('/api/task/getTaskAdminSupport?moduleType=' + moduleType).then(res => res.data)
    }

    static searchTaskList(moduleType, search: string): Promise<TaskDto[]> {
        return this.api.get('/api/task/searchConfirm?moduleType=' + moduleType + "&search=" + search).then(res => res.data)
    }

    static getTasksWithFilter(moduleType, module, confirmType, search, startDate, endDate,orderStartDate, orderEndDate, clientTypes, aggrementTypes, selectedDepartments, personelId): Promise<TaskDto[]> {
        return this.api.get('/api/task/filter?moduleType='+moduleType+"&module="+module+
            "&confirmType="+confirmType+"&search="+search+"&startDate="+startDate+"&endDate="+endDate+"&orderStartDate="+orderStartDate
            +"&orderEndDate="+orderEndDate+
            "&clientTypes="+clientTypes+"&aggrementTypes="+aggrementTypes+"&selectedDepartments="+ selectedDepartments + "&personelId=" + personelId
        ).then(res => res.data)
    }

    static getTasksWithFilterAdminSupport(moduleType, module, confirmType, search, startDate, endDate,orderStartDate, orderEndDate, clientTypes, aggrementTypes, selectedDepartments,personelId): Promise<TaskDto[]> {
        return this.api.get('/api/task/filterAdminSupport?moduleType='+moduleType+"&module="+module+
            "&confirmType="+confirmType+"&search="+search+"&startDate="+startDate+"&endDate="+endDate+"&orderStartDate="+orderStartDate
            +"&orderEndDate="+orderEndDate+
            "&clientTypes="+clientTypes+"&aggrementTypes="+aggrementTypes + "&selectedDepartments=" + selectedDepartments + "&personelId=" + personelId
        ).then(res => res.data)
    }

    static getModuleTypes() {
        return this.api.get('/api/taskconfirm/getModuleTypes').then(res => res.data)
    }

    static getTaskListConfirm(): Promise<Task[]> {
        return this.api.get('/api/task/confirm').then(res => res.data)
    }

    static getClient(id: number): Promise<Client> {
        return this.api.get('/api/client/detail?clientId=' + id).then(res => res.data)
    }

    static getNewAddressList(id: number): Promise<AddressNewInfo[]> {
        return this.api.get('/api/address/addressList?clientId=' + id).then(res => res.data)
    }// getNewAddressList Yeni Eklendi

    static getClients(reminderClientTpe : string): Promise<Client> {
        return this.api.get('/api/client/getReminderTemplate?reminderClientTpe=' + reminderClientTpe).then(res => res.data)
    }

    static  getInvoiceNumber(clientId : string, invoiceType: string){
        return this.api.get('/api/invoice/getInvoiceNumber?clientId=' + clientId + '&invoiceType=' + invoiceType).then(res=>res.data)
    }

    static getCompanyByClientId(id: number): Promise<Client> {
        return this.api.get('/api/client/detail?clientId=' + id).then(res => res.data)
    }

    static getClientByTaskId(id: number): Promise<Client> {
        return this.api.get('/api/task/getclientbytaskid?taskId=' + id).then(res => res.data)
    }

    static addUser(request: UserDTO) {
        return this.api.post('/api/user/addUser', request).then(res => res.data)
    }

    static addUserLanguage( userlanguage : string) {
        return this.api.post('/api/user/addUserLanguage?userlanguage=' + userlanguage).then(res => res.data)
    }

    static changePassword(oldPassword, newPassword) {
        return this.api.post('/api/user/changepassword', {oldPassword, newPassword}).then(res => res.data)
    }

    static createUser(request: CustomerCreate) {
        return this.api.post('/api/user/addUser', request).then(res => res.data)
    }

    static updateUser(request: UserDTO) {
        return this.api.post('/api/user/updateUser', request).then(res => res.data)
    }

    static getUsers(): Promise<UserDTO[]> {
        return this.api.get('/api/user/allUsers').then(res => res.data)
    }

    static getUserById(id): Promise<UserDTO[]> {
        return this.api.get('/api/user/getUser?id=' + id).then(res => res.data)
    }

    static getLettersByFilter(letterType: string, search: string) {
        return this.api.get('/letters/lettersByMultiFilter?' +
            'letterType=' + letterType +
            '&search=' + search)
            .then(res => res.data)
    }

    static getLetters(letterType, search, orderColumn, orderBy, page, rowsPerPage){
        return this.api.get('/letters/lettersByMultiFilter?letterType=' + letterType + "&search=" + search +
            '&orderColumn=' + orderColumn +
            '&orderBy=' + orderBy +
            '&page=' + page +
            '&rowsPerPage=' + rowsPerPage)
            .then(res => res.data)
    }

    static getLetterTypes(): Promise<LetterType[]> {
        return this.api.get('/lettertype/getAll').then(res => res.data)
    }

    static  getAllDivided() {
        return this.api.get('/api/divided/getAll').then(res=>res.data)
    }


    static getAllDividedDirectors(){
        return this.api.get('/api/divided/getAllDirectors').then(res=>res.data)
    }

    static getAllClientForDivided(){
        return this.api.get('/api/divided/getAllClient').then(res=>res.data)
    }

    static getAllLetterTypes(): Promise<LetterType[]> {
        return this.api.get('/lettertype/getAllUsedLetterTypes').then(res => res.data)
    }

    static getLetterTypesForFilter(): Promise<LetterType[]> {
        return this.api.get('c').then(res => res.data)
    }
    static getLetterTypesByClientType(clientType): Promise<LetterType[]> {
        return this.api.get('/lettertype/getByClientType?clientType='+clientType ).then(res => res.data)
    }

    static saveLetters(request: Letter, file: File, onProcess: (loaded: number, total: number) => void): Promise<Letter> {
        const form = new FormData()
        form.append("file", file);
        form.append("letter", JSON.stringify(request));
        return this.api.post('/letters/save', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    static saveLettersTask(request: Letter): Promise<Letter> {
        const form = new FormData()
        form.append("file", null);
        form.append("letter", JSON.stringify(request));
        return this.api.post('/letters/save', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data)
    }

    static editLetter(request: Letter): Promise<Letter> {
        return this.api.post('/letters/editLetter', request).then(res => res.data)
    }

    static saveCustomLetter(request: Letter, file: File, onProcess: (loaded: number, total: number) => void) {
        const form = new FormData()
        form.append("file", file);
        form.append("letter", JSON.stringify(request));
        return this.api.post('/letters/save/custom', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
        // return this.api.post('/letters/save/custom', request).then(res => res.data)
    }

    static saveLetterType(request: LetterType) {
        return this.api.post('/lettertype/save', request).then(res => res.data)
    }

    static getLetterTypeByID(letterTypeID) {
        return this.api.get("lettertype/getbyid?letterTypeID=" + letterTypeID).then(res => JSON.parse(decodeURIComponent(escape(window.atob(res.data.letterTemplate)))))
    }

    static getLetterByID(letterID) {
        return this.api.get("lettertype/getbyid?letterID=" + letterID).then(res => JSON.parse(decodeURIComponent(escape(window.atob(res.data.letterTemplate)))))
    }

    static deleteLetterByID(letterID) {
        return this.api.get("lettertype/delete?id=" + letterID).then(res => res.data)

    }

    static getModuleType(taskID) {
        return this.api.get("/api/task/getModuleType?taskId=" + taskID).then(res => res.data)
    }

    static getLetterBytaskID(taskID) {
        return this.api.get("letters/getbytaskid?taskID=" + taskID).then(res => res.data)
    }

    static getLettersByClientID(clientId, orderColumn, orderBy, page, rowsPerPage) {
        return this.api.get("/letters/getbyclientid?clientId=" + clientId +
            "&orderColumn=" + orderColumn +
            "&orderBy=" + orderBy +
            "&page=" + page +
            "&rowsPerPage=" + rowsPerPage )
            .then(res => res.data)
    }

    static getHelpByID(helpID) {
        return this.api.get("help/getbyid?letterID=" + helpID).then(res => JSON.parse(decodeURIComponent(escape(window.atob(res.data.helpDocument)))))
    }

    static saveHelp(request: Help): Promise<Help> {
        return this.api.post('/help/save', request).then(res => res.data)
    }

    static getHelpTypes(): Promise<HelpType[]> {
        return this.api.get('/helpType/get').then(res => res.data)
    }

    static getHelps(): Promise<Help[]> {
        return this.api.get('/help/get').then(res => res.data)
    }

    static getHelpByTaskID(taskID) {
        return this.api.get('/help/getbytaskid?taskID=' + taskID).then(res => res.data)
    }

    static getHelpByClientID(clientId) {
        return this.api.get('/help/gethelpbyclientid?clientId=' + clientId).then(res => res.data)
    }

    static getStatements() {
        return this.api.get('/api/company/banktransactions').then(res => res.data)
    }

    static getTaskListByClientID(taskId) {
        return this.api.get('/api/task/gettaskbyclientid?clientId=' + taskId).then(res => res.data)
    }

    static getDocumentByID(documentId) {
        return this.api.get('/api/document/getdocumentbyid?documentId=' + documentId).then(res => res.data)
    }

    static sendMessageWithAttachment(to: string, subject: string, clientName: string, pathToAttachment: any) {
        return this.api.post('/api/mail/invoice' + to + subject + clientName + pathToAttachment).then(res => res.data)
    }

    public static uploadDocumentData1(file: File, documentType: string, companyId, description, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("documentType", documentType);
        form.append("companyId", companyId);
        form.append("description", description);
        return this.api.post('/api/file/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static uploadDocumentPdf(file: File, documentType: string, companyId, description, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("documentType", documentType);
        form.append("companyId", companyId);
        form.append("description", description);
        return this.api.post('/api/file/upload/pdf', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static uploadDocumentData2(file: File, clientId, bankType: string, statementType: string, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("bankType", bankType);
        form.append("clientId", clientId);
        form.append("statementType", statementType);
        return this.api.post('/api/file/uploadstatement', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static uploadDocumentData3(file: File, bankType: string, statementType: string, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("bankType", bankType);
        form.append("statementType", statementType);
        return this.api.post('/api/file/uploadExport', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static uploadDocumentData(file: File, documentType: string, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("documentType", documentType);
        return this.api.post('/api/file/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static updateDocument(document: DocumentClass): Promise<FileUploadResult> {
        return this.api.post('/api/document/document', document).then(res => res.data)
    }

    public static uploadImagesData(file: any, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        return this.api.post('/api/file/profil/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    static saveBuyer(request: BuyerInfo) {
        return this.api.post('/api/buyer/save', request).then(res => res.data)
    }

    static getBuyersByClientId(clientId) {
        return this.api.get('/api/buyer/allbyclientid?clientId=' + clientId).then(res => res.data)
    }

    static getBuyerById(buyerId) {
        return this.api.get('/api/buyer/detail?buyerId=' + buyerId).then(res => res.data)
    }

    static deleteBuyerById(buyerId) {
        return this.api.get('/api/buyer/delete?buyerId=' + buyerId).then(res => res.data)
    }

    static saveClientAccount(request: ClientAccount) {
        return this.api.post('/api/bank/save', request).then(res => res.data)
    }

    static getClientAccountsByClientId(clientId) {
        return this.api.get('/api/bank/allbyclientid?clientId=' + clientId).then(res => res.data)
    }

    static getClientAccountById(accountId) {
        return this.api.get('/api/bank/detail?bankId=' + accountId).then(res => res.data)
    }

    static deleteClientAccountById(accountId) {
        return this.api.get('/api/bank/delete?bankId=' + accountId).then(res => res.data)
    }

    static controlBankForDelete(client_id: string, bank_id: string) {
        return this.api.get('/api/bank/controlBankForDelete?client_id=' + client_id + '&bank_id=' + bank_id).then((res => res.data))
    }
    static controlBankMasterForDelete(bank_name: string) {
        return this.api.get('/api/bank/controlBankMasterForDelete?bank_name=' + bank_name).then((res => res.data))

    }
    static controlForDeleteCustomer(client_id: string, buyer_name: string) {
        return this.api.get('/api/buyer/controlForDeleteCustomer?client_id=' + client_id + '&buyer_name=' + buyer_name).then((res => res.data))
    }

    static saveInvoiceSettings(request: InvoiceSettings) {
        const form = new FormData()
        form.append("file", request?.logo);
        form.append("clientId", request?.clientId?.toString());
        form.append("isInvoiceNumber", request?.isInvoiceNumber?.toString());
        form.append("selectedInvoiceType", request?.selectedInvoiceType?.toString());
        form.append("web", request?.web?.toString());
        form.append("isMailSend", request?.isMailSend?.toString());
        form.append("invoiceType", request?.invoiceType?.toString());
        if (request.isInvoiceNumber) {
            form.append("invoiceNumber", request?.invoiceNumber?.toString());
        }
        return this.api.post('/api/invoice/invoiceSettings', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data)
    }

    static getInvoiceSettings(clientId, invoiceType) {
        return this.api.get('/api/invoice/getInvoiceSettings?clientId=' + clientId + '&invoiceType=' + invoiceType).then(res => res.data)
    }

    static invoiceSettingsType (clientId){
        return this.api.get('/api/invoice/invoiceSettingsType?clientId=' + clientId).then(res => res.data)
    }

    static saveInvoice(request: Invoice) {
        return this.api.post('/api/invoice/addInvoice', request).then(res => res.data)
    }

    static notificationCreate(  notificationCreateDTO:NoticeLogDTO ){
        return this.api.post('/api/notice/create',notificationCreateDTO).then(res => res.data)
    }

    public static notificationCreateWithFile( notificationCreateDTO : NoticeLogDTO, file: File, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const notificationCreate = new FormData()
        notificationCreate.append("file", file);
        notificationCreate.append("notificationCreateDTO", JSON.stringify(notificationCreateDTO));

        return this.api.post('/api/notice/create', notificationCreate, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    static resendNotification(  notificationCreateDTO:NoticeLogDTO ){
        return this.api.post('/api/notice/resendNotification',notificationCreateDTO).then(res => res.data)
    }

    static getClientByFilter(clientType:string , aggrementType:string , isVat:boolean){
        return this.api.get('/api/client/getClientByFilter?clientType='+clientType+'&aggrementType='+aggrementType+'&isVat='+isVat).then(res => res.data)
    }


    static getNotice(page: number, size: number, notificationType: string, clientType: string, search: string) {
        return this.api.get('/api/notice/getNotices?page=' + page + '&size=' + size + '&notificationType=' + notificationType +
            '&clientType=' + clientType + '&search=' + search).then(res => res.data)
    }

    static getNoticeLogFilters(notificationFilter : NotificationLogFilter) {
        return this.api.post('/api/notice/getNoticeLogFilters',notificationFilter).then(res => res.data)
    }

    static getNoticeLogFiltersOfSearch(search:string , subject:String , message: String) {
        return this.api.post('/api/notice/getNoticeLogFiltersOfSearch?search=' +search+ '&subject=' +subject+ '&message='+message ).then(res => res.data)
    }

    static getClientReminderCount(date1:string ,date2:string ,date3:string , date4:string) {
        return this.api.get('/api/client/getClientReminderCount?date1=' + date1 +'&date2=' + date2 +'&date3=' +date3+'&date4='+date4).then(res => res.data)
    }

    static getNoticeLogs(page: number, size: number) {
        return this.api.get('/api/notice/getNoticesLog?page=' + page + '&size=' + size).then(res => res.data)
    }

    static getClientOfNotifications( notiId) {
        return this.api.get('/api/notice/getClientByNotifications?notiId=' + notiId).then(res => res.data)
    }

    static getSupportTask(search: string , supportType : string ,statusType : string ) {
        return this.api.get('/help/getSupportsFilter?search=' + search +'&supportType=' + supportType + '&statusType='+ statusType).then(res => res.data)
    }

    static getDirectorDetailById(id : string){
        //todo fonksiyonun içeriği hazırlanacak, SupportTask sayfası için gerekli
    }

    static getSupport(search: string) {
        return this.api.get('/help/getSupports?search=' + search).then(res => res.data)
    }

    //*************************************************

    static getInvoiceListByClientId(clientId) {
        return this.api.get('/api/invoice/allbyclientid?clientId=' + clientId).then(res => res.data)
    }

    static getInvoiceById(invoiceId) {
        return this.api.get('/api/invoice/detailbyinvoiceId?invoiceId=' + invoiceId).then(res => res.data)
    }
    static getInvoice(invoiceId) {
        return this.api.get('/api/invoice/getInvoice?invoiceId=' + invoiceId).then(res => res.data)
    }
    static deleteInvoiceById(invoiceId) {
        return this.api.get('/api/invoice/delete?invoiceId=' + invoiceId).then(res => res.data)
    }

    static getNewInvoice(clientId, invoiceType, invoiceDate) {
        return this.api.get('/api/invoice/newInvoiceGet?clientId=' + clientId + '&invoiceType=' + invoiceType + '&invoiceDate=' + invoiceDate).then(res => res.data)
    }

    static getInvoiceUpdate(invoiceId) {
        return this.api.get('/api/invoice/getInvoiceUpdate?invoiceId=' + invoiceId).then(res => res.data)
    }

    static forgotPasswordStep1(email: string) {
        return this.api.get('/auth/forgotPasswordStepOne?email=' + email).then(res => res.data)
    }

    static resetPassword(resetPassword) {
        return this.api.post('/auth/resetPassword', resetPassword).then(res => res.data)
    }

    static getClientApplicationDecline(clientId) {
        return this.api.get('/api/client/getClientDecline?clientId=' + clientId).then(res => res.data)
    }

    static getInvoiceByTaskId(taskId) {
        return this.api.get('/api/invoice/getInvoiceTaskDetail?taskId=' + taskId).then(res => res.data)
    }

    static getExpenseByTaskId(taskId) {
        return this.api.get('/api/cashInvoice/getByTaskId?taskId=' + taskId).then(res => res.data)
    }

    static getIncomeByTaskId(taskId){
        return this.api.get('/api/income/getByTaskId?taskId=' + taskId).then(res =>res.data)
    }
    static getInvoiceUpdateRequest(invoiceId) {
        return this.api.get('/api/invoice/updateInvoiceRequest?invoiceId=' + invoiceId).then(res => res.data)
    }

    static getInvoiceDeleteRequest(invoiceId) {
        return this.api.get('/api/invoice/deleteInvoiceRequest?invoiceId=' + invoiceId).then(res => res.data)
    }

    static userPassivetoActive(id: string) {
        return this.api.get('/api/user/activeUser?id=' + id).then(res => res.data)
    }

    static userActivetoPassive(id: string) {
        return this.api.get('/api/user/passiveUser?id=' + id).then(res => res.data)
    }

    static getAllUsersByPaging(page, perpage) {
        return this.api.get('/api/user/allUsers?page=' + page + '?perpage=' + perpage).then(res => res.data)
    }

    public static saveHelp2(request: Help, file: File, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("helpDTO", JSON.stringify(request));
        return this.api.post('/help/save', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    public static saveHelpType(request: HelpType) {
        const form = new FormData()
        form.append("helpTypeDTO", JSON.stringify(request));
        return this.api.post('/helpType/save', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data)
    }

    public static updateHelpType(request: HelpType) {
        const form = new FormData()
        form.append("helpTypeDTO", JSON.stringify(request));
        return this.api.post('/helpType/update', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data)
    }
    // Büşra Budan
    public static saveDivided( divided:Divided, clientId){
        return this.api.post('/api/divided/save?clientId='+clientId, divided).then(res => res.data)
    }

    public static getByDirectorIdForDivided(directorId){
        return this.api.get('/api/divided/getByDirectorId?directorId=' + directorId).then(res=>res.data)
    }

    public static answeredTicket(request: Help, file: File, onProcess: (loaded: number, total: number) => void): Promise<FileUploadResult> {
        const form = new FormData()
        form.append("file", file);
        form.append("helpDTO", JSON.stringify(request));

        return this.api.post('/help/answeredTicket', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent: any) {
                onProcess(progressEvent.loaded, progressEvent.total)
            }
        }).then(res => res.data)
    }

    static deleteFileById(documentId) {
        return this.api.get('/api/document/delete?documentId=' + documentId).then(res => res.data)
    }

    public static saveCashInvoice(request: CashInvoice) {
        const form = new FormData()
        form.append("id", request?.id?.toString());
        form.append("file", request?.photo);
        form.append("clientId", request?.clientId?.toString());
        form.append('cashPrice', request?.cashPrice?.toString());
        form.append('cashCurrencyOfPayment', request?.cashCurrencyOfPayment?.toString());
        form.append('cashInvoiceTypeId', request?.cashInvoiceTypeId?.toString());
        form.append('cashInvoiceDate', request?.cashInvoiceDate?.toString());
        form.append('isActive', request?.is_active?.toString());
        form.append('cashInvoiceType', request?.cashInvoiceType?.toString());
        return this.api.post('/api/cashInvoice/saveCash', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(res => res.data)

    }
    public static saveIncomeInvoice(request: Income) {
        const form = new FormData()
        form.append("id", request?.id?.toString());
        form.append("file", request?.photo);
        form.append("clientId", request?.clientId?.toString());
        form.append('price', request?.price?.toString());
        form.append('currencyOfPayment', request?.currencyOfPayment?.toString());
        form.append('incomeTypeId', request?.incomeTypeId?.toString());
        form.append('incomeDate', request?.incomeDate?.toString());
        form.append('isActive', request?.is_active?.toString());
        form.append('incomeType', request?.incomeType?.toString());
        return this.api.post('/api/income/saveIncome', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(res => res.data)

    }

    static updateCashInvoice(request : CashInvoice) {
        const form = new FormData()
        form.append("id", request?.id?.toString());
        form.append("file", request?.photo);
        form.append("clientId", request?.clientId?.toString());
        form.append("fileName", request?.fileName?.toString());
        form.append("filePath", request?.filePath?.toString());
        form.append('cashPrice', request?.cashPrice?.toString());
        form.append('cashCurrencyOfPayment', request?.cashCurrencyOfPayment?.toString());
        form.append('cashInvoiceTypeId', request?.cashInvoiceTypeId?.toString());
        form.append('cashInvoiceDate', request?.cashInvoiceDate?.toString());
        form.append('isActive', request?.is_active?.toString());
        form.append('cashInvoiceType', request?.cashInvoiceType?.toString());
        return this.api.post('/api/cashInvoice/updateCashInvoice', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(res => res.data)
    }

    static getCashInvoice(clientId, page, size) {
        return this.api.get('/api/cashInvoice/allByClientId?clientId=' + clientId + '&page=' + page + '&size=' + size).then(res => res.data)
    }

    static getCashInvoiceUnPage(clientId) {
        return this.api.get('/api/cashInvoice/allByClientId?clientId=' + clientId).then(res => res.data)
    }

    static deleteCashInvoiceById(cashId) {
        return this.api.get('/api/cashInvoice/delete?cashId=' + cashId).then(res => res.data)
    }

    static deleteIncomeById(incomeId) {
        return this.api.get('/api/income/delete?incomeId=' + incomeId).then(res => res.data)
    }

    static createDeleteRequestCashInvoiceById(cashId) {
        return this.api.get('/api/cashInvoice/createDeleteRequest?cashId=' + cashId).then(res => res.data)
    }

    static createDeleteRequestIncomeById(incomeId) {
        return this.api.get('/api/income/createDeleteRequest?incomeId=' + incomeId).then(res => res.data)
    }

    static createUpdateRequestCashInvoiceById(cashId) {
        return this.api.get('/api/cashInvoice/createUpdateRequest?cashId=' + cashId).then(res => res.data)
    }

    static createUpdateRequestIncomeById(incomeId){
        return this.api.get('/api/income/createUpdateRequest?incomeId=' + incomeId).then(res=>res.data)
    }

    static getReminderTypes(): Promise<ReminderType[]> {
        return this.api.get('/api/remindertype/get').then(res => res.data)
    }

    static saveReminderType(request: ReminderType) {
        return this.api.post('/api/remindertype/save', request).then(res => res.data)
    }

    static deleteReminderType(request: ReminderType) {
        return this.api.post('/api/remindertype/delete', request).then(res => res.data)
    }

    static saveReminder(request: Reminder) {
        return this.api.post('/api/reminder/save', request).then(res => res.data)
    }

    static getReminder(): Promise<Reminder>{
        return this.api.get('/api/reminder/get').then(res => res.data)
    }

    static getReminderTypeByID(reminderTypeID) {
        return this.api.get("/api/remindertype/getbyid?reminderTypeID=" + reminderTypeID).then(
            //res => JSON.parse(decodeURIComponent(escape(window.atob(res.data.reminderTemplate))))
            res => res.data
        )
    }

    static getClientsByUserId(id: number) {
        return this.api.get('/api/client/getCompaniesByUserId?userId=' + id).then(res => res.data)
    }

    static getFounderOwnerByClientId(id: number) {
        return this.api.get('/api/founderOwner/apply?clientId=' + id).then(res => res.data)
    }

    static getAllCustomLetters() {
        return this.api.get("letters/get/custom").then(res => res.data);
    }

    static getCompaniesByUserId(id: number) {
        return this.api.get('/api/client/getCompaniesByUserId?userId=' + id).then(res => res.data)
    }

    static getExpensesType() {
        return this.api.get('/api/cashInvoice/getExpensesType').then(res => res.data)
    }

    static getIncomesType(){
        return this.api.get('/api/income/getIncomesType').then(res =>res.data)
    }

    static getExpensesTypeById(id) {
        return this.api.get('/api/cashInvoice/getExpensesTypeById?id='+id).then(res => res.data)
    }

    static getIncomesTypeById(id){
        return this.api.get('/api/income/getIncomeTypeById?id=' +id).then(res=>res.data)
    }

    static saveExpensesType(expensesType: ExpensesType) {
        return this.api.post('/api/cashInvoice/saveExpensesType', expensesType).then(res => res.data)
    }

    static saveIncomeType(incomesType: IncomesType) {
        return this.api.post('/api/income/saveIncomesType', incomesType).then(res => res.data)
    }

    static updateExpensesType(request: ExpensesType) {
        return this.api.post('/api/cashInvoice/update', request).then(res => res.data)
    }
    static updateIncomesType(request: IncomesType) {
        return this.api.post('/api/income/update', request).then(res => res.data)
    }
    static deleteExpensesType(id: number) {
        return this.api.delete('/api/cashInvoice/deletedeneme/' + id).then(res => res.data)
    }

    static deleteIncomeType(id: number) {
        return this.api.delete('/api/income/deleteIncome/' + id).then(res => res.data)
    }

    static deleteExpenseTypeById(expenseTypeId) {
        return this.api.get('/api/cashInvoice/deleteExpenseType?expenseTypeId=' + expenseTypeId).then(res => res.data)
    }

    static deleteIncomeTypeById(incomeTypeId) {
        return this.api.get('/api/income/deleteIncomeType?incomeTypeId=' + incomeTypeId).then(res => res.data)
    }

    static controlExpenseForDelete( expensesType_id: number) {
        return this.api.get('/api/cashInvoice/controlExpensesForDelete?&expensesType_id=' + expensesType_id).then((res => res.data))
    }

    static controlIncomeForDelete( incomesType_id: number) {
        return this.api.get('/api/income/controlIncomeForDelete?&incomesType_id=' + incomesType_id).then((res => res.data))
    }

    static getExcelExport (clientId:number){
        return this.api.post('/api/excel/getExport?clientId=' + clientId).then((res =>res.data));
    }
    //module Type- Bank master değişiklikleri
    static getAllModuleTypes() {
        return this.api.get('/api/moduletype/getModuleTypes').then(res => res.data)
    }
    static getModuleTypeId(id:any){
        return this.api.get('/api/moduletype/getModuleTypeId?id=' + id).then(res=>res.data)
    }
    static updateModuleType(request: ModuleTypeDTO) {
        return this.api.post('/api/moduletype/updateModuleType', request).then(res => res.data)
    }

    static getAllBankMaster() {
        return this.api.get('/api/bank/getBankMaster').then(res => res.data)
    }
    static getBankMaster(id){
        return this.api.get('/api/bank/getBank?id=' + id).then(res=>res.data);
    }
    static updateBankMaster(request: BankMasterDTO) {
        return this.api.post('/api/bank/updateBankName', request).then(res => res.data)
    }
    static deleteBankMaster(id: number) {
        return this.api.get('/api/bank/deleteBankMaster?id='+id).then(res => res.data)
    }
    static saveBankMaster(bankName: BankMasterDTO) {
        return this.api.post('/api/bank/saveBankMaster/', bankName).then(res => res.data)
    }

    static getPersonel() {
        return this.api.get('/api/personeldetails/getPersonel').then(res => res.data)
    }
    static getStatus() {
        return this.api.get('/api/personeldetails/getStatus').then(res => res.data)
    }
    static getTasksByPersonelId(id: number) {
        return this.api.get('/api/taskconfirm/gettasksbypersonelid?personelId='+id).then(res => res.data)
    }
    static getAllDepartments() {
        return this.api.get('/api/department/getAll').then(res => res.data)
    }
    static getInProgressTasks(){
        return this.api.get('/api/taskconfirm/inProgress').then(resp=>resp.data)
    }
    static getCompletedTasks(){
        return this.api.get('/api/taskconfirm/done').then(resp=>resp.data)
    }

    static getReminderCompanyList(): Promise<ReminderType[]> {
        return this.api.get('/api/reminder/getList').then(res => res.data)
    }
}
