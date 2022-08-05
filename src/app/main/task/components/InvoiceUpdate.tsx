import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Menu,
    MenuItem,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TextField,
    Typography
} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import history from '@history';
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import api from "../../../services/BackendApi";
import {
    Client,
    Company,
    CustomerClientDTO,
    DirectorDetail,
    FounderOwner,
    Invoice,
    Task
} from "../../../types/UserModel";
import {Link, useParams} from "react-router-dom";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded/FusePageCarded";
import Icon from "@material-ui/core/Icon";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import {Div} from "../../../components/Grid";
import Formsy from "formsy-react";
import TasksStatus from "../task/TaskStatus";
import BackendApi from "../../../services/BackendApi";
import moment from "moment";
import {useTranslation} from "react-i18next";
import config from "../../../services/Config";
import {fileURLToPath} from "url";
import Invoice1 from "../../invoice/Invoice1";


const useStyles = makeStyles(theme => ({
    root: {
        background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`
    },
    divider: {
        backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    seller: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark),
        marginRight: -88,
        paddingRight: 66,
        width: 480
    }
}));
const getDocumentUrlByFileName = (fileName: string) => {
    let idOfClient = fileName?.substring(0, 4);
    //current user için çalışıyor.
    //var id = sessionStorage.getItem("companyId")
    var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + idOfClient + "/" + fileName
    return url
}
function InvoiceUpdate(props: any) {
    const [client, setClient] = useState<Client>({} as Client);
    const [taskDetail, setTaskDetail] = useState<Task>();
    const [isLoading, setIsLoading] = useState(false)
    const [open2, setOpen2] = React.useState(false);
    const [confirm, setConfirm] = useState<string>();
    // const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [message,setMessage] = useState<string>();

    const {t} = useTranslation('task');

    const theme = useTheme();
    //@ts-ignore
    let routerParams = useParams();
    //@ts-ignore
    const {taskid} = routerParams;
    const classes = useStyles();
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const [invoice, setInvoice] = useState<Invoice>()
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    const getProcess = () => {
        setOpen2(false)
        setIsLoading(true);
        BackendApi.getTaskConfirm(confirm, parseInt(window.atob(taskid)),message).then(data => {
            history.push("/tasks/list/"+window.btoa("ADMIN"))
            setIsLoading(false)
        })
    }

    useEffect(() => {
        // @ts-ignore
        if (window.atob(taskid)) {
            api.getInvoiceByTaskId(window.atob(taskid)).then(res => setInvoice(res))
            api.getClientByTaskId(parseInt(window.atob(taskid))).then(response => {
                setClient(response);
                const {company, addressList, customerClients, founderOwner, tasks, documents} = response;
                // setCustomerClients(customerClients);
                setTaskDetail(tasks?.find(task => task.id === parseInt(window.atob(taskid))))
            })
        } else {
            history.push("/tasks/list/" + window.btoa("ADMIN"))
        }


    }, [])

    const handleClose3 = () => {
        setOpen2(false);
    };

    return (
        <FusePageCarded
            classes={{
                content: 'flex-grow flex-shrink-0 p-0 print:p-0',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                client && (
                    <div className="flex flex-1 w-full items-center justify-between">
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            <Typography

                                className="normal-case flex items-center sm:mb-12"
                                component={Link}
                                role="button"
                                to={"/tasks/list/" + window.btoa("ADMIN")}
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t('TASKS')}</span>
                            </Typography>
                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                <Typography className="text-16 sm:text-20 truncate">
                                    {t('INVOICEUPDATEREQUEST')}{` - ${window.atob(taskid)}`}
                                </Typography>
                                <Typography className="text-12 sm:text-12 truncate">
                                    {t('PROCESSDATE')}{` - ${taskDetail?.processDate}`}
                                </Typography>

                            </div>
                        </div>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <Button variant="contained" color="secondary" {...bindTrigger(popupState)}>
                                        {routingData?.confirmType == null ? (t('SELECTSTATE')) : (t(routingData?.confirmType.toString()))}
                                        {/*Select State*/}
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            setConfirm("INPROGRESS")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('INPROGRESS')}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("DONE")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('DONE')}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("REJECTED");
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('REJECTED')}</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                        {isLoading && (<CircularProgress color={"secondary"} className={"z-40 float-right"}/>)}
                        <Dialog
                            fullWidth={true}
                            maxWidth={"xs"}
                            open={open2}
                            onClose={handleClose3} aria-labelledby="customized-dialog-title" >
                            <DialogTitle id="customized-dialog-title" >
                                {t("CONFIRMMESSAGE")}
                            </DialogTitle>
                            <DialogContent dividers>
                                <FormControl className={"w-full"}>
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        multiline
                                        // value={fileDescription}
                                        value={message}
                                        onChange={(e)=>setMessage(e.target.value)}
                                        rows={3}
                                        rowsMax={4}
                                        name="message"
                                        variant={"outlined"}
                                    />
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button variant={"contained"} onClick={handleClose3} color="secondary">
                                    {t("CLOSE")}
                                </Button>
                                <Button variant={"contained"} onClick={()=>getProcess()} color="primary">
                                    {t("SAVE")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )
            }

            content={
                <div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0 sm:p-64 print:p-0')}>
                    {invoice && (
                        <FuseAnimate animation={{translateY: [0, '100%']}} duration={600}>
                            <Invoice1 client={client} invoice={invoice}></Invoice1>
                            {/*<Card className="mx-auto w-xl print:w-full print:p-8 print:shadow-none rounded-8">*/}
                            {/*    <CardContent className="p-88 print:p-0">*/}
                            {/*        <Typography color="textSecondary" className="mb-32">*/}
                            {/*            {invoice.invoiceDate}*/}
                            {/*        </Typography>*/}

                            {/*        <div className="flex justify-between">*/}
                            {/*            <div>*/}
                            {/*                <table className="mb-16">*/}
                            {/*                    <tbody>*/}
                            {/*                    <tr>*/}
                            {/*                        <td className="pb-4">*/}
                            {/*                            <Typography*/}
                            {/*                                className="font-light"*/}
                            {/*                                variant="h6"*/}
                            {/*                                color="textSecondary"*/}
                            {/*                            >*/}
                            {/*                                {t("INVOICE")}*/}
                            {/*                            </Typography>*/}
                            {/*                        </td>*/}
                            {/*                        <td className="pb-4 px-16">*/}
                            {/*                            <Typography className="font-light" variant="h6">*/}
                            {/*                                {invoice.invoiceCode}*/}
                            {/*                            </Typography>*/}
                            {/*                        </td>*/}
                            {/*                    </tr>*/}

                            {/*                    <tr>*/}
                            {/*                        <td>*/}
                            {/*                            <Typography color="textSecondary">INVOICE DATE</Typography>*/}
                            {/*                        </td>*/}
                            {/*                        <td className="px-16">*/}
                            {/*                            <Typography>{moment(invoice.invoiceDate).format('DD-MM-YYYY')}</Typography>*/}
                            {/*                        </td>*/}
                            {/*                    </tr>*/}

                            {/*                    <tr>*/}
                            {/*                        <td>*/}
                            {/*                            <Typography color="textSecondary">DUE DATE</Typography>*/}
                            {/*                        </td>*/}
                            {/*                        <td className="px-16">*/}
                            {/*                            <Typography>{moment(invoice.dueDate).format('DD-MM-YYYY')}</Typography>*/}
                            {/*                        </td>*/}
                            {/*                    </tr>*/}
                            {/*                    </tbody>*/}
                            {/*                </table>*/}

                            {/*                <Typography color="textSecondary">{invoice.buyerName}</Typography>*/}

                            {/*                {invoice.buyerAddress && (*/}
                            {/*                    <Typography color="textSecondary">{invoice.buyerAddress}</Typography>*/}
                            {/*                )}*/}
                            {/*                {invoice.buyerPhone && (*/}
                            {/*                    <Typography color="textSecondary">{invoice.buyerPhone}</Typography>*/}
                            {/*                )}*/}
                            {/*                {invoice.buyerEmail && (*/}
                            {/*                    <Typography color="textSecondary">{invoice.buyerEmail}</Typography>*/}
                            {/*                )}*/}
                            {/*                /!*{invoice.client.website && (*!/*/}
                            {/*                /!*    <Typography color="textSecondary">{invoice.buyer}</Typography>*!/*/}
                            {/*                /!*)}*!/*/}
                            {/*            </div>*/}

                            {/*            <div className={clsx(classes.seller, 'flex items-center p-16')}>*/}
                            {/*                <img className="w-80" src={getDocumentUrlByFileName(client?.clientFileName)}*/}
                            {/*                     alt="logo"/>*/}

                            {/*                <div className={clsx(classes.divider, 'w-px mx-8 h-96 opacity-50')}/>*/}

                            {/*                <div className="px-8">*/}
                            {/*                    <Typography color="inherit">{invoice.clientName}</Typography>*/}

                            {/*                    {invoice.invoiceAddress && (*/}
                            {/*                        <Typography color="inherit">{invoice.clientAddress}</Typography>*/}
                            {/*                    )}*/}
                            {/*                    {invoice.clientEmail && (*/}
                            {/*                        <Typography color="inherit">{invoice.clientEmail}</Typography>*/}
                            {/*                    )}*/}
                            {/*                    {invoice.clientPhone && (*/}
                            {/*                        <Typography color="inherit">{invoice.clientPhone}</Typography>*/}
                            {/*                    )}*/}
                            {/*                    /!*{invoice.from.website && (*!/*/}
                            {/*                    /!*    <Typography color="inherit">{invoice.from.website}</Typography>*!/*/}
                            {/*                    /!*)}*!/*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}

                            {/*        <div className="mt-64">*/}
                            {/*            <Table className="simple">*/}
                            {/*                <TableHead>*/}
                            {/*                    <TableRow>*/}
                            {/*                        <TableCell>{t("SERVICE")}</TableCell>*/}
                            {/*                        <TableCell>{t("UNIT")}</TableCell>*/}
                            {/*                        <TableCell align="right">{t("UNITPRICE")}</TableCell>*/}
                            {/*                        <TableCell align="right">{t("QUANTITY")}</TableCell>*/}
                            {/*                        <TableCell align="right">{t("TOTAL")}</TableCell>*/}
                            {/*                    </TableRow>*/}
                            {/*                </TableHead>*/}
                            {/*                <TableBody>*/}
                            {/*                    {invoice.invoiceDetails?.map(service => (*/}
                            {/*                        <TableRow key={service.id}>*/}
                            {/*                            <TableCell>*/}
                            {/*                                <Typography*/}
                            {/*                                    variant="subtitle1">{service.itemDescription}</Typography>*/}
                            {/*                            </TableCell>*/}
                            {/*                            <TableCell>{service.amount}</TableCell>*/}
                            {/*                            <TableCell align="right">*/}
                            {/*                                {formatter.format(service.unitPrice)}*/}
                            {/*                            </TableCell>*/}
                            {/*                            <TableCell align="right">{service.quantity}</TableCell>*/}
                            {/*                            <TableCell*/}
                            {/*                                align="right">{formatter.format(service.amount)}</TableCell>*/}
                            {/*                        </TableRow>*/}
                            {/*                    ))}*/}
                            {/*                </TableBody>*/}
                            {/*            </Table>*/}

                            {/*            <Table className="simple mt-32">*/}
                            {/*                <TableBody>*/}
                            {/*                    <TableRow>*/}
                            {/*                        <TableCell>*/}
                            {/*                            <Typography*/}
                            {/*                                className="font-medium"*/}
                            {/*                                variant="subtitle1"*/}
                            {/*                                color="textSecondary"*/}
                            {/*                            >*/}
                            {/*                                {t("SUBTOTAL")}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                        <TableCell align="right">*/}
                            {/*                            <Typography*/}
                            {/*                                className="font-medium"*/}
                            {/*                                variant="subtitle1"*/}
                            {/*                                color="textSecondary"*/}
                            {/*                            >*/}
                            {/*                                {formatter.format(invoice.subTotal)}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                    </TableRow>*/}
                            {/*                    <TableRow>*/}
                            {/*                        <TableCell>*/}
                            {/*                            <Typography*/}
                            {/*                                className="font-medium"*/}
                            {/*                                variant="subtitle1"*/}
                            {/*                                color="textSecondary"*/}
                            {/*                            >*/}
                            {/*                                {t("TAX")}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                        <TableCell align="right">*/}
                            {/*                            <Typography*/}
                            {/*                                className="font-medium"*/}
                            {/*                                variant="subtitle1"*/}
                            {/*                                color="textSecondary"*/}
                            {/*                            >*/}
                            {/*                                {formatter.format(invoice.vat)}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                    </TableRow>*/}
                            {/*                    /!*<TableRow>*!/*/}
                            {/*                    /!*    <TableCell>*!/*/}
                            {/*                    /!*        <Typography*!/*/}
                            {/*                    /!*            className="font-medium"*!/*/}
                            {/*                    /!*            variant="subtitle1"*!/*/}
                            {/*                    /!*            color="textSecondary"*!/*/}
                            {/*                    /!*        >*!/*/}
                            {/*                    /!*            DISCOUNT*!/*/}
                            {/*                    /!*        </Typography>*!/*/}
                            {/*                    /!*    </TableCell>*!/*/}
                            {/*                    /!*    <TableCell align="right">*!/*/}
                            {/*                    /!*        <Typography*!/*/}
                            {/*                    /!*            className="font-medium"*!/*/}
                            {/*                    /!*            variant="subtitle1"*!/*/}
                            {/*                    /!*            color="textSecondary"*!/*/}
                            {/*                    /!*        >*!/*/}
                            {/*                    /!*            {formatter.format(invoice.total)}*!/*/}
                            {/*                    /!*        </Typography>*!/*/}
                            {/*                    /!*    </TableCell>*!/*/}
                            {/*                    /!*</TableRow>*!/*/}
                            {/*                    <TableRow>*/}
                            {/*                        <TableCell>*/}
                            {/*                            <Typography className="font-light" variant="h4"*/}
                            {/*                                        color="textSecondary">*/}
                            {/*                                {t("TOTAL")}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                        <TableCell align="right">*/}
                            {/*                            <Typography className="font-light" variant="h4"*/}
                            {/*                                        color="textSecondary">*/}
                            {/*                                {formatter.format(invoice.total)}*/}
                            {/*                            </Typography>*/}
                            {/*                        </TableCell>*/}
                            {/*                    </TableRow>*/}
                            {/*                </TableBody>*/}
                            {/*            </Table>*/}
                            {/*        </div>*/}

                            {/*        <div className="mt-96">*/}
                            {/*            {invoice.dueDate && (<Typography className="mb-24 print:mb-12" variant="body1">*/}
                            {/*                {t("PLEASEPAYWITHIN")}{invoice.dueDate}{t("THANKFORBUSINESS")}*/}
                            {/*            </Typography>)}*/}

                            {/*            <div className="flex">*/}
                            {/*                <div className="flex-shrink-0">*/}
                            {/*                    <img className="w-32"*/}
                            {/*                         src={getDocumentUrlByFileName(client?.clientFileName)}*/}
                            {/*                         alt="logo"/>*/}
                            {/*                </div>*/}

                            {/*                <Typography*/}
                            {/*                    className="font-medium mb-64 px-24"*/}
                            {/*                    variant="caption"*/}
                            {/*                    color="textSecondary"*/}
                            {/*                >*/}
                            {/*                    In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut*/}
                            {/*                    ac*/}
                            {/*                    congue dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras*/}
                            {/*                    aliquet*/}
                            {/*                    facilisis pellentesque. Nunc hendrerit quam at leo commodo, a suscipit*/}
                            {/*                    tellus*/}
                            {/*                    dapibus. Etiam at felis volutpat est mollis lacinia. Mauris placerat sem*/}
                            {/*                    sit*/}
                            {/*                    amet velit mollis, in porttitor ex finibus. Proin eu nibh id libero*/}
                            {/*                    tincidunt*/}
                            {/*                    lacinia et eget eros.*/}
                            {/*                </Typography>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </CardContent>*/}
                            {/*</Card>*/}
                        </FuseAnimate>
                    )}
                </div>
            }
            innerScroll
        />
        // <div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0 sm:p-64 print:p-0')}>
        //     {invoice && (
        //         <FuseAnimate animation={{translateY: [0, '100%']}} duration={600}>
        //             <Card className="mx-auto w-xl print:w-full print:p-8 print:shadow-none rounded-8">
        //                 <CardContent className="p-88 print:p-0">
        //                     <Typography color="textSecondary" className="mb-32">
        //                         {invoice.invoiceDate}
        //                     </Typography>
        //
        //                     <div className="flex justify-between">
        //                         <div>
        //                             <table className="mb-16">
        //                                 <tbody>
        //                                 <tr>
        //                                     <td className="pb-4">
        //                                         <Typography
        //                                             className="font-light"
        //                                             variant="h6"
        //                                             color="textSecondary"
        //                                         >
        //                                             INVOICE
        //                                         </Typography>
        //                                     </td>
        //                                     <td className="pb-4 px-16">
        //                                         <Typography className="font-light" variant="h6">
        //                                             {invoice.invoiceCode}
        //                                         </Typography>
        //                                     </td>
        //                                 </tr>
        //
        //                                 <tr>
        //                                     <td>
        //                                         <Typography color="textSecondary">INVOICE DATE</Typography>
        //                                     </td>
        //                                     <td className="px-16">
        //                                         <Typography>{invoice.invoiceDate}</Typography>
        //                                     </td>
        //                                 </tr>
        //
        //                                 <tr>
        //                                     <td>
        //                                         <Typography color="textSecondary">DUE DATE</Typography>
        //                                     </td>
        //                                     <td className="px-16">
        //                                         <Typography>{invoice.dueDate}</Typography>
        //                                     </td>
        //                                 </tr>
        //                                 </tbody>
        //                             </table>
        //
        //                             <Typography color="textSecondary">{invoice.buyerName}</Typography>
        //
        //                             {invoice.buyerAddress && (
        //                                 <Typography color="textSecondary">{invoice.buyerAddress}</Typography>
        //                             )}
        //                             {invoice.buyerPhone && (
        //                                 <Typography color="textSecondary">{invoice.buyerPhone}</Typography>
        //                             )}
        //                             {invoice.buyerEmail && (
        //                                 <Typography color="textSecondary">{invoice.buyerEmail}</Typography>
        //                             )}
        //                             {/*{invoice.client.website && (*/}
        //                             {/*    <Typography color="textSecondary">{invoice.buyer}</Typography>*/}
        //                             {/*)}*/}
        //                         </div>
        //
        //                         <div className={clsx(classes.seller, 'flex items-center p-16')}>
        //                             <img className="w-80" src={`data:image/jpeg;base64,${invoice?.clientLogo}`}
        //                                  alt="logo"/>
        //
        //                             <div className={clsx(classes.divider, 'w-px mx-8 h-96 opacity-50')}/>
        //
        //                             <div className="px-8">
        //                                 <Typography color="inherit">{invoice.clientName}</Typography>
        //
        //                                 {invoice.invoiceAddress && (
        //                                     <Typography color="inherit">{invoice.clientAddress}</Typography>
        //                                 )}
        //                                 {invoice.clientEmail && (
        //                                     <Typography color="inherit">{invoice.clientEmail}</Typography>
        //                                 )}
        //                                 {invoice.clientPhone && (
        //                                     <Typography color="inherit">{invoice.clientPhone}</Typography>
        //                                 )}
        //                                 {/*{invoice.from.website && (*/}
        //                                 {/*    <Typography color="inherit">{invoice.from.website}</Typography>*/}
        //                                 {/*)}*/}
        //                             </div>
        //                         </div>
        //                     </div>
        //
        //                     <div className="mt-64">
        //                         <Table className="simple">
        //                             <TableHead>
        //                                 <TableRow>
        //                                     <TableCell>SERVICE</TableCell>
        //                                     <TableCell>UNIT</TableCell>
        //                                     <TableCell align="right">UNIT PRICE</TableCell>
        //                                     <TableCell align="right">QUANTITY</TableCell>
        //                                     <TableCell align="right">TOTAL</TableCell>
        //                                 </TableRow>
        //                             </TableHead>
        //                             <TableBody>
        //                                 {invoice.invoiceDetails?.map(service => (
        //                                     <TableRow key={service.id}>
        //                                         <TableCell>
        //                                             <Typography
        //                                                 variant="subtitle1">{service.itemDescription}</Typography>
        //                                         </TableCell>
        //                                         <TableCell>{service.amount}</TableCell>
        //                                         <TableCell align="right">
        //                                             {formatter.format(service.unitPrice)}
        //                                         </TableCell>
        //                                         <TableCell align="right">{service.quantity}</TableCell>
        //                                         <TableCell align="right">{formatter.format(service.amount)}</TableCell>
        //                                     </TableRow>
        //                                 ))}
        //                             </TableBody>
        //                         </Table>
        //
        //                         <Table className="simple mt-32">
        //                             <TableBody>
        //                                 <TableRow>
        //                                     <TableCell>
        //                                         <Typography
        //                                             className="font-medium"
        //                                             variant="subtitle1"
        //                                             color="textSecondary"
        //                                         >
        //                                             SUBTOTAL
        //                                         </Typography>
        //                                     </TableCell>
        //                                     <TableCell align="right">
        //                                         <Typography
        //                                             className="font-medium"
        //                                             variant="subtitle1"
        //                                             color="textSecondary"
        //                                         >
        //                                             {formatter.format(invoice.subTotal)}
        //                                         </Typography>
        //                                     </TableCell>
        //                                 </TableRow>
        //                                 <TableRow>
        //                                     <TableCell>
        //                                         <Typography
        //                                             className="font-medium"
        //                                             variant="subtitle1"
        //                                             color="textSecondary"
        //                                         >
        //                                             TAX
        //                                         </Typography>
        //                                     </TableCell>
        //                                     <TableCell align="right">
        //                                         <Typography
        //                                             className="font-medium"
        //                                             variant="subtitle1"
        //                                             color="textSecondary"
        //                                         >
        //                                             {formatter.format(invoice.vat)}
        //                                         </Typography>
        //                                     </TableCell>
        //                                 </TableRow>
        //                                 {/*<TableRow>*/}
        //                                 {/*    <TableCell>*/}
        //                                 {/*        <Typography*/}
        //                                 {/*            className="font-medium"*/}
        //                                 {/*            variant="subtitle1"*/}
        //                                 {/*            color="textSecondary"*/}
        //                                 {/*        >*/}
        //                                 {/*            DISCOUNT*/}
        //                                 {/*        </Typography>*/}
        //                                 {/*    </TableCell>*/}
        //                                 {/*    <TableCell align="right">*/}
        //                                 {/*        <Typography*/}
        //                                 {/*            className="font-medium"*/}
        //                                 {/*            variant="subtitle1"*/}
        //                                 {/*            color="textSecondary"*/}
        //                                 {/*        >*/}
        //                                 {/*            {formatter.format(invoice.total)}*/}
        //                                 {/*        </Typography>*/}
        //                                 {/*    </TableCell>*/}
        //                                 {/*</TableRow>*/}
        //                                 <TableRow>
        //                                     <TableCell>
        //                                         <Typography className="font-light" variant="h4" color="textSecondary">
        //                                             TOTAL
        //                                         </Typography>
        //                                     </TableCell>
        //                                     <TableCell align="right">
        //                                         <Typography className="font-light" variant="h4" color="textSecondary">
        //                                             {formatter.format(invoice.total)}
        //                                         </Typography>
        //                                     </TableCell>
        //                                 </TableRow>
        //                             </TableBody>
        //                         </Table>
        //                     </div>
        //
        //                     <div className="mt-96">
        //                         {invoice.dueDate && (<Typography className="mb-24 print:mb-12" variant="body1">
        //                             Please pay within {invoice.dueDate} days. Thank you for your business.
        //                         </Typography>)}
        //
        //                         <div className="flex">
        //                             <div className="flex-shrink-0">
        //                                 <img className="w-32" src={`data:image/jpeg;base64,${invoice?.clientLogo}`}
        //                                      alt="logo"/>
        //                             </div>
        //
        //                             <Typography
        //                                 className="font-medium mb-64 px-24"
        //                                 variant="caption"
        //                                 color="textSecondary"
        //                             >
        //                                 In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac
        //                                 congue dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet
        //                                 facilisis pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus
        //                                 dapibus. Etiam at felis volutpat est mollis lacinia. Mauris placerat sem sit
        //                                 amet velit mollis, in porttitor ex finibus. Proin eu nibh id libero tincidunt
        //                                 lacinia et eget eros.
        //                             </Typography>
        //                         </div>
        //                     </div>
        //                 </CardContent>
        //             </Card>
        //         </FuseAnimate>
        //     )}
        // </div>
    );
}

export default InvoiceUpdate;
